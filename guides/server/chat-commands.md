---
title: Chat and commands
sidebar:
  order: 6
---

# Chat and commands

Chat lines and slash commands are the first interactive surface most game modes build. Both arrive as server events, and one global switch decides whether plain chat is relayed to other players automatically.

## How a chat line travels

When a player submits the chat input, the line takes this path:

1. The client's **`chatSend`** event fires synchronously. A handler returning `false` swallows the line before it leaves the machine (`Chat.send(text)` bypasses this event).
2. The line reaches the server. If it starts with `/`, the server raises **`playerCommand`** with the command name and whitespace-split arguments. Otherwise it raises **`playerChat`**.
3. If the **default relay** is enabled (it is by default), a plain chat line is forwarded to every client, where it arrives through the client's `chatMessage` event and the native chat overlay draws it.

```js title="server/main.js"
Events.on("playerChat", (player, text) => {
  console.log(`${player.nickname}: ${text}`);
});
```

Disable the relay to take full control of chat distribution — team chat, proximity chat, or muting:

```js title="server/main.js"
Chat.setDefaultRelay(false);
```

With the relay off, nothing is forwarded until you do it yourself: forward the line to your chosen recipients with `player.emit`, and draw it client-side (with a [web view](/guides/web-views/), [Render2D](/guides/render2d/), or `Hud.showMessage`).

## A command dispatcher

`playerCommand` gives you `(player, command, args)` with the leading `/` stripped. A lookup table keeps the handler flat as the command set grows:

```js title="server/main.js"
const COMMANDS = {
  veh(player, args) {
    const modelId = args.length ? Number(args[0]) : Math.floor(Math.random() * 52);
    if (!Number.isInteger(modelId) || modelId < 0 || modelId > 51) {
      return notify(player, "Usage: /veh [0-51]");
    }
    const p = player.position;
    Vehicle.spawn(modelId, new Vector3(p.x + 3, p.y, p.z));
    notify(player, `Spawned vehicle model ${modelId}.`);
  },

  heal(player, args) {
    const amount = args.length ? Number(args[0]) : null;
    if (amount === null) player.restoreHealth();
    else player.setHealth(amount);
    notify(player, "Health restored.");
  },

  announce(player, args) {
    const text = args.join(" ");
    if (!text) return notify(player, "Usage: /announce <text>");
    Events.emitAllClients("mygm:announce", { text, from: player.nickname });
  },
};

Events.on("playerCommand", (player, command, args) => {
  const handler = COMMANDS[command.toLowerCase()];
  if (!handler) return notify(player, `Unknown command /${command}.`);
  handler(player, args);
});
```

`notify()` is the one-line HUD feedback helper from [Server, client, and the UI](/guides/ui-architecture/) — there is no server-side "send chat line" API, so command feedback goes to the player's HUD (or your own chat UI) via an intent.

:::tip
Validate arguments the way you would any untrusted input: `args` is whatever the player typed. `Number(...)` plus a range check before every numeric use saves you from `NaN` positions and out-of-range model ids.
:::

## Console commands

Lines typed into the **server console** that are not a built-in server command are raised through `consoleCommand` — same shape, no player:

```js title="server/main.js"
Events.on("consoleCommand", (command, args) => {
  if (command === "players") {
    for (const p of World.players) console.log(`  ${p.nickname} (ping ${p.ping}ms)`);
  }
});
```

## Client-side chat control

The client can drive the native chat UI directly — everything local, no server involvement:

| Call | Effect |
|:-----|:-------|
| `Chat.open()` / `Chat.close()` / `Chat.isOpen()` | Control the chat input box. |
| `Chat.setUIVisible(visible)` | Show or hide the chat overlay without touching the input. |
| `Chat.send(text)` | Submit a line programmatically, bypassing `chatSend`. |
| `Events.on("chatMessage", (m) => …)` | Observe incoming lines (`m.author`, `m.text`, `m.color`) — for a custom chat renderer. |

A custom chat interface is the combination: hide the native overlay with `Chat.setUIVisible(false)`, render `chatMessage` events yourself, and submit through `Chat.send`.
