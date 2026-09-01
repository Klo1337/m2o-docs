---
title: Server, client, and the UI
sidebar:
  order: 5
---

# Server, client, and the UI

The single most common source of confusion when writing an M2O game mode is this: **all native UI is client-side**. HUD messages, hints, countdown timers, questions and dialogs, the lockpick minigame, the camera, the map waypoint — they all run on the player's machine and exist nowhere else. There is no `player.showMessage()` on the server, and nothing about a hint or a prompt is replicated.

This guide explains the architecture that follows from that fact, and the one pattern — *intents down, consequences up* — that every game mode ends up using.

## Who owns what

| Server owns (authoritative, replicated) | Client owns (local, per player) |
|:----------------------------------------|:--------------------------------|
| Players, health, money, weapons | HUD visibility, messages, hints, timers |
| Vehicles and their full state | Questions, dialogs, the lockpick minigame |
| World time, weather, traffic | The camera and screen fades |
| Blips, markers, labels, props, NPCs | Key binds and input gating |
| The shop item registry | Web views, Render2D drawing |

A consequence worth internalizing: when the server wants a player to *see* something, it cannot draw it. It can only ask that player's client to draw it.

## Intents down

The server sends a small event describing *what it wants*, and the client performs the local call. The demo game mode routes every such request through one event and a dispatch table, which scales much better than one dedicated event per UI verb:

```js title="server/main.js"
// Ask one player's client to run a local-only call by name.
function clientCall(player, fn, args) {
  player.emit("mygm:client", JSON.stringify({ fn, args: args || {} }));
}

// Anywhere in your game mode:
clientCall(player, "hud.showMessage", { text: "Round starts in 10s", seconds: 5 });
clientCall(player, "camera.reset");
```

```js title="client/main.js"
const CLIENT_CALLS = {
  "hud.showMessage": (a) => Hud.showMessage(a.text, a.seconds),
  "hud.setVisible":  (a) => Hud.setVisible(a.visible),
  "hud.startTimer":  (a) => Hud.startTimer(a.seconds),
  "camera.reset":    ()  => Camera.reset(),
  "controls.setStyle": (a) => Controls.setStyle(a.flags),
};

Events.on("mygm:client", (data) => {
  const call = data && CLIENT_CALLS[data.fn];
  if (call) call(data.args || {});
});
```

One emit goes down per request, the work happens locally, and nothing comes back per frame. The table is also your security surface: the server can only trigger calls the client chose to expose.

:::tip
Most game modes want a one-line "tell this player something" helper. Define it once and use it everywhere the old chat-feedback habit would go:

```js
function notify(player, text, seconds = 4) {
  clientCall(player, "hud.showMessage", { text, seconds });
}
```

Later guides in this documentation use `notify()` for player feedback.
:::

## Consequences up

Prompts show the same shape in reverse. The native question screen and its answer both live on the client, so a prompt is one local call and one local callback — and only the part the game mode must act on travels to the server.

```js title="server/main.js"
const QUESTION = { GARAGE: 1 }; // your own opaque ids, echoed back

Events.on("playerCommand", (player, command) => {
  if (command !== "garage") return;
  clientCall(player, "ui.showQuestion", {
    questionId: QUESTION.GARAGE,
    question: "Store this vehicle?",
    answers: ["Yes", "No"],
    timeoutSeconds: 10,
  });
});

Events.onClient("mygm:questionAnswer", (player, answer) => {
  if (answer.questionId !== QUESTION.GARAGE) return;
  if (answer.answerId === 1) {
    // ... store the vehicle: the server owns the consequence.
    notify(player, "Vehicle stored.");
  }
});
```

```js title="client/main.js"
CLIENT_CALLS["ui.showQuestion"] = (a) =>
  Ui.showQuestion(a.questionId, a.question, a.answers, a.timeoutSeconds);

// The native prompt resolves locally; relay only what the server acts on.
Events.on("questionAnswer", (answer) => {
  Events.emitServer("mygm:questionAnswer", answer);
});
```

`answerId` is the 1-based answer slot, or `-1` on timeout. `Ui.showDialog` (a Yes/No confirm) resolves through the `dialogAnswer` client event the same way, and `Ui.startLockpick` through `lockpickResult` (`0` completed, `1` failed, `2` escaped). A purely cosmetic prompt never needs to reach the server at all.

:::caution
The relay is a client event, so apply the [trust rules](/guides/events/#the-trust-boundary): a client can fabricate `mygm:questionAnswer` without ever seeing a prompt. Track *which* prompt you offered each player server-side, and ignore answers you did not ask for. Never let the payload pick the reward.
:::

## Why this split exists

Everything the server replicates costs bandwidth for every player in range, forever. UI state is high-churn, player-specific, and irrelevant to everyone else — replicating it would be pure waste. Keeping it client-side means:

- a hint or timer costs one event, not a synced entity;
- prompts resolve with zero network round-trips unless the game mode cares;
- the server stays the single authority on things that must not drift (money, health, vehicle state), and never authority on things that cannot (what is on a particular screen).

The same reasoning explains the input APIs: `Controls.setStyle` gates abilities on the local machine, so the server ships a number down once (see [Input and controls](/guides/input-controls/)) rather than intercepting input packets.

## Related guides

- [HUD and native UI](/guides/hud/) — the full `Hud`, `Ui`, `Fade`, and nametag surface.
- [Render2D](/guides/render2d/) — drawing custom native UI.
- [Web views](/guides/web-views/) — HTML/CSS interfaces with the same intent/consequence flow.
