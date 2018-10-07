'use strict';

const readline = require(`readline`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const rlp = (question, cb) => new Promise((resolve, reject) => {
  rl.question(question, cb(resolve, reject));
});

const closeRl = (message) => () => {
  console.log(message);
  rl.close();
};

const affirmativeResponses = [`y`, `yes`];
const isResponseAffirmative = (response) => affirmativeResponses.includes(response.toLowerCase());
const askClosedQuestion = (question, data) => rlp(
    question,
    askClosedQuestionCb(data),
);
const askClosedQuestionCb =
  (data) => (resolve, reject) => (response) => isResponseAffirmative(response) ? resolve(data) : reject(data);

module.exports = {
  askClosedQuestion,
  askClosedQuestionCb,
  closeRl,
  rlp,
};
