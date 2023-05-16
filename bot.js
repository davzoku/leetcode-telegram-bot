require("dotenv").config();
const axios = require('axios');
const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    ctx.reply(
      `Welcome <a href="${ctx.message.from.id}.dev">${ctx.message.from.id}</a>`,
      { parse_mode: "HTML" }
    );
});
bot.help((ctx) => ctx.reply("Send me a command `!lc`"));

/**
 * Get name from the msg for addressing the user in reply
 *
 * @param {msTelegramBot.Messageg} msg
 */
function getNameForReply(msg) {
  let namePart = 'Anonymous user';
  if (msg.from.username) {
    namePart = `@${msg.from.username}`;
  } else if (msg.from.first_name) {
    namePart = msg.from.first_name;
  }
  return namePart;
}

// Command for public user to trigger daily LC question reply
bot.hears('!lc', async (msg) => {
  const chatId = msg.chat.id;
  const msgThreadId = msg.message.message_thread_id;
  const messageId = msg.message.message_id;
  const namePart = getNameForReply(msg);
  // console.log("msg", JSON.stringify(msg.message, null, 2));
  console.log("chatId "+ chatId)
  console.log("msgThreadId "+ msgThreadId)
  console.log("messageId "+ messageId)

  getLCQuestion()
    .then((result) => {
      console.log(result);
      let reply = `Hello ${namePart}! Here's today's question:\r\n\r\n${result}`;
      reply = reply.replace(/<\/?p>/g, '\n\n').replace(/&nbsp;/g, ' ');
      bot.telegram.sendMessage(chatId, reply, {
        message_thread_id: msgThreadId,
        reply_to_message_id: messageId,
        // parse_mode: 'HTML',
      });
      // msg.replyWithHTML(reply, {
      //   reply_to_message_id: messageId
      // });
    })
    .catch((error) => {
      console.error(error);
    });
});

// GraphQL query for LC daily question
const dailyLCQuery = `
query questionOfToday {
        activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                status
                title
                content
            }
        }
    }
`;

// POST request to get LC daily question
const getLCQuestion = async () => {
  const response = await axios({
    url: 'https://leetcode.com/graphql',
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    data: {
      query: dailyLCQuery,
    },
  });
  const data = response.data.data.activeDailyCodingChallengeQuestion;
  const date = data.date;
  const question = data.question;
  const title = question.title;
  const link = 'https://leetcode.com' + data.link;
  const difficulty = question.difficulty;
  const content = question.content;
  let diffIndicator = '';
  if (difficulty === 'Easy') {
    diffIndicator = '🟩';
  } else if (difficulty === 'Medium') {
    diffIndicator = '🟨';
  } else if (difficulty === 'Hard') {
    diffIndicator = '🟥';
  }
  // const msg = `*👨‍💻LC Daily Question👩‍💻*\r\n*Date:* ${date}\r\n*Title: *${title}\r\n*Difficulty:* ${difficulty} ${diffIndicator}\r\n*Content:* ${content}\r\n${link}`;
  const msg = `*👨‍💻LC Daily Question👩‍💻*\r\n*Date:* ${date}\r\n*Title: *${title}\r\n*Difficulty:* ${difficulty} ${diffIndicator}\r\n${link}`;  
  return msg;
};
// for local testing
bot.launch();


//lambda export handler for deployment

// exports.handler = (event, context, callback) => {
//   const tmp = JSON.parse(event.body);
//   bot.handleUpdate(tmp);
//   return callback(null, {
//     statusCode: 200,
//     body: "",
//   });
// };
