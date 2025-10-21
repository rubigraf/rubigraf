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

const bot = new Rubigraf(process.env.BOT_TOKEN, { polling: true });

bot.launch();

bot.on(RubigrafEvents.NewMessage, async (ctx, payload, next) => {
  await ctx.reply("Hello! 👋 This is a Rubigraf bot.");

  return next();
});
```

- Command Event Example with Event Hooks:
```js
const { Rubigraf, RubigrafEvents } = require("rubigraf");

const bot = new Rubigraf(process.env.BOT_TOKEN, { polling: true });

bot.launch();

// onBefore: inspect the ctx and attach shared data to payload
// If user not registered, set payload.registered = false so main handler & after hook see it.
bot.onBefore(RubigrafEvents.Command, async (ctx, payload, next) => {
  const userId = ctx.senderId;

  // lightweight DB check (example)
  const isRegistered = await db.users.exists(userId);
  payload.registered = isRegistered; // shared with later hooks
  payload.userId = userId;

  // allow main handler to continue
  return next();
});

// main handler: do work and augment payload if needed
bot.on(RubigrafEvents.Command, async (ctx, payload, next) => {
  const { command } = ctx;

  if (command === "start") {
    if (!payload.registered) {
      // register user and record result for after-hook
      await db.users.create(payload.userId);
      payload.registered = true;
      payload.justRegistered = true;
    }
  }

  // continue to after hook
  return next();
});

// onAfter: run follow-up tasks using the same payload object
bot.onAfter(RubigrafEvents.Command, async (ctx, payload) => {
  // payload.registered / payload.justRegistered are available here
  if (ctx.command === "start" && payload.justRegistered) {
    await ctx.reply("Welcome to Rubigraf!");
  } else if (ctx.command === "start") {
    await ctx.reply("Welcome back!");
  }

  // you can also use payload for telemetry/logging
  globalMetrics.increment("commands_handled", { cmd: ctx.command, registered: !!payload.registered });
});

// You can also get Rubigraf errors from version 1.2.8 onwards
bot.on(RubigrafEvents.Error, (err, logger) => logger.error(err));
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
