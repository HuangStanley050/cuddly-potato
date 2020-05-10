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

export const joke = async (event, context) => {
  let api = `https://api.chucknorris.io/jokes/random`;
  let jokeData = await axios.get(api);
  let time = Date.now();
  let creationDate = moment(time).format("MM/DD/YYYY");
  let joke = jokeData.data.value;
  console.log(joke);
  console.log(creationDate);
};
