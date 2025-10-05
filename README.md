<header>
  <div align="center" aria-label="Rubigraf Header">
    <img src="docs/assets/logo.svg" width="128" height="128" alt="Rubigraf Logo" />
    <h1>Rubigraf</h1>
    <blockquote>
      🧠 A modern, type-safe, event-driven <strong>Rubika Bot Framework</strong> for Node.js.
    </blockquote>
      <br />
      <p>
        <em>
          <strong>Rubigraf</strong> lets you easily create Rubika bots using a clean, modular, and middleware-based architecture — similar to <strong>Telegraf</strong> or <strong>Discord.js</strong> but fully optimized for <strong>Rubika</strong>.
        </em>
      </p>
    <p>
      <a href="https://www.npmjs.com/package/rubigraf">
        <img src="https://img.shields.io/npm/v/rubigraf.svg?style=for-the-badge&color=brightgreen" alt="Rubigraf NPM Version Badge" />
      </a>
      <a href="https://github.com/rubigraf/rubigraf/blob/main/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge" alt="Rubigraf License" />
      </a>
      <a href="https://github.com/rubigraf/rubigraf/stargazers">
        <img src="https://img.shields.io/github/stars/rubigraf/rubigraf?style=for-the-badge&color=yellow" alt="Rubigraf GitHub Stars" />
      </a>
      <a href="https://github.com/rubigraf/rubigraf/forks">
        <img src="https://img.shields.io/github/forks/rubigraf/rubigraf?style=for-the-badge&color=teal" alt="Rubigraf GitHub Forks" />
      </a>
    </p>
  </div>
</header>

---

## ✨ Overview
**Rubigraf** is designed to simplify Rubika bot development using a clean, event-driven, and type-safe structure inspired by **Telegraf**.

📘 [Full Documentation →](https://rubigraf.github.io/docs) _(coming soon)_

## 🚀 Installation

```bash
npm install rubigraf
# or
yarn add rubigraf
# or
pnpm add rubigraf
```

## 🧩 Example Usage

Below are a few examples demonstrating Rubigraf's event-based structure.

- NewMessage Event Example:
```js
const { Rubigraf, RubigrafEvents } = require("rubigraf");

const bot = new Rubigraf(process.env.BOT_TOKEN, { pollIntervalMs: 0 });

bot.launch();

bot.on(RubigrafEvents.NewMessage, async (ctx, next) => {
  await ctx.reply("Hello! 👋 This is a Rubigraf bot.");

  return next();
});
```

- Command Event Example with Event Hooks:
```js
const { Rubigraf, RubigrafEvents } = require("rubigraf");

const bot = new Rubigraf(process.env.BOT_TOKEN, { pollIntervalMs: 0 });

bot.launch();

// Check if user is registered or not.
// If it's their first time, the 'onBefore' hook allows the 'on' handler to continue for the 'Command' event on current Update.
bot.onBefore(RubigrafEvents.Command, async (ctx, next) => {
  const { command, senderId } = ctx;

  if (command === "start" && !isRegistered(senderId)) {
    return next();
  }
})

// If registerUser was successful, the 'onAfter' hook for the 'Command' event will continue.
bot.on(RubigrafEvents.Command, async (ctx, next) => {
  const { command, senderId } = ctx;

  if (command === "start") {
    await registerUser(senderId);
  }

  return next();
});

bot.onAfter(RubigrafEvents.Command, async (ctx) => {
  const { command } = ctx;

  if (command === "start") {
    await ctx.reply("Welcome to Rubigraf!");
  }
});
```

## 🧩 TypeScript Usage

Rubigraf includes full type definitions, so you can use it seamlessly with TypeScript.

## 📦 Features

- ⚡ Fast and modular event system  
- 💬 Supports messages, files, stickers, polls, and more  
- 🧠 Middleware-based architecture  
- 🧱 TypeScript support out of the box  
- 🔁 Command and context handling similar to Telegraf  
- 🧍 User-friendly API design

## 🧠 Concepts

Rubigraf provides **contexts** to interact with updates. Each context gives you access to specific update data and helper methods such as `ctx.reply()`, `ctx.forwardMessage()`, and `ctx.editMessageText()`.

Example:
```js
bot.on(RubigrafEvents.Command, async (ctx) => {
  if (ctx.command === "start") {
    await ctx.reply("Welcome to Rubigraf!");
  }
});
```

## 📜 License

Rubigraf is licensed under the [MIT License](./LICENSE).

## 💬 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/rubigraf/rubigraf/issues).

---

<p align="center"><strong>Made with ❤️ by <a href="https://github.com/rubigraf/">Rubigraf Team</a></strong></p>
