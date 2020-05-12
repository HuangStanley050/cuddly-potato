// export const hello = async (event, context) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       message: `Go Serverless v1.0! ${(await message({ time: 1, copy: 'Your function executed successfully!'}))}`,
//     }),
//   };
// };
//
// const message = ({ time, ...rest }) => new Promise((resolve, reject) =>
//   setTimeout(() => {
//     resolve(`${rest.copy} (with a delay)`);
//   }, time * 1000)
// );
import axios from "axios";
import moment from "moment";
import dynamoDb from "./libs/dynamoDB-lib";
import AWS from "aws-sdk";
import nodeMailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
const polly = new AWS.Polly();
const s3 = new AWS.S3();

export const joke = async (event, context) => {
  let api = `https://api.chucknorris.io/jokes/random`;
  let jokeData = await axios.get(api);
  let time = Date.now();
  let creationDate = moment(time).format("MM/DD/YYYY HH:mm");

  let joke = jokeData.data.value;
  const pollyParams = {
    OutputFormat: "mp3",
    Text: joke,
    VoiceId: "Salli",
  };
  const params = {
    TableName: `chuckNorrisJokes`,
    Item: {
      creationDate,
      joke,
    },
  };

  try {
    await dynamoDb.put(params);
    let result = await polly.synthesizeSpeech(pollyParams).promise();
    let Key = uuidv4() + ".mp3";

    let s3Params = {
      Bucket: "chuck-norris-audio",
      Key,
      Body: result.AudioStream,
    };
    //console.log(result);
    await s3.putObject(s3Params).promise();
    let url = await s3.getSignedUrlPromise("getObject", {
      Bucket: `chuck-norris-audio`,
      Key,
    });

    const transporter = nodeMailer.createTransport({
      service: "yahoo",
      auth: {
        user: "infamous_godhand@yahoo.com",
        pass: process.env.EMAIL_PASSWD,
      },
    });
    const mailOptions = {
      from: "infamous_godhand@yahoo.com",
      to: "infamous_godhand@yahoo.com",
      subject: `chuck norris jokes`,
      text: `${url}`,
    };
    await transporter.sendMail(mailOptions);
    console.log("all okay");
  } catch (err) {
    console.log(err);
  }
  // console.log(joke);
  // console.log(creationDate);
};
