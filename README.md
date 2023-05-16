# leetcode-telegram-bot

📱🤖🏷 A simple telegram bot to retrieve leetcode questions

## Supported Commands

1. `!lc`: to get the question of the day.

## Tutorial

[Build Telegram Bots with JavaScript - The Complete Guide - YouTube](https://www.youtube.com/watch?v=joApqWBrm20&list=PLX2ojSA27XYhIopdU2RRQIMe7gfwcKL84)

## Inspiration

[paradite/16x-bot](https://github.com/paradite/16x-bot)

## Hosting

AWS Lambda

## Webhook Setup

```
https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<API_GATEWAY_POST_API>
```

## Development

Toggle between local testing and deployment on lambda.

```
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
```
