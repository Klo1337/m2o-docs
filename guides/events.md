---
title: Events
sidebar:
  order: 4
---

# Events

M2O scripts receive framework and game events through `Events`, and use the same bus to define their own. This guide covers the listener API, the client↔server bridge, and the small set of client events that can *veto* native behavior.

## Listening

Use `on` for a persistent listener, `once` for a one-shot listener, and the unsubscribe function returned by `on` when the listener is no longer needed. Handlers belong to the resource that registered them and may return promises; native dispatch waits for all matching handlers to settle.

```ts
const unsubscribe = Events.on("resourceStart", (resourceName) => {
  console.log(`${resourceName} started`);
});

// Later:
unsubscribe();
```

The generated `EventMap` ([server reference](/reference/server/interfaces/eventmap/), [client reference](/reference/client/interfaces/eventmap/)) is the authoritative list of native events for each environment. Each property type is the callback's argument tuple, and `EventName` is the union of its property names. Client and server maps differ because an event is only listed where it is actually dispatched: `playerConnect` exists only on the server, `chatMessage` only on the client, and the client's `playerDamage` is a local mirror of the server's with extra fields.

## Script-defined events

Script-defined events are intentionally open-ended and are not part of `EventMap`. Within one environment, `emit` reaches every resource's `on` handlers, `emitTo` targets one resource, and `emitLocal`/`onLocal` stay inside the emitting resource.

## Crossing the network

Four primitives move events between the server and clients:

| Direction | Sender | Receiver |
|:----------|:-------|:---------|
| server → one player | `player.emit(name, payloadJson)` | `Events.on(name, handler)` on that client |
| server → every player | `Events.emitAllClients(name, payload)` | `Events.on(name, handler)` on each client |
| client → server | `Events.emitServer(name, payload)` | `Events.onClient(name, (player, payload) => …)` on the server |

`player.emit` takes its payload as a **JSON string**; it arrives on the client already parsed. A full round-trip looks like this:

```js title="server/main.js"
// The client asked for something; reply to just that player.
Events.onClient("mygm:requestBalance", (player) => {
  player.emit("mygm:balance", JSON.stringify({ amount: player.getMoney() }));
});
```

```js title="client/main.js"
Key.bind("b", "down", () => {
  Events.emitServer("mygm:requestBalance", {});
});

Events.on("mygm:balance", (data) => {
  Hud.showMessage(`You have $${data.amount.toFixed(2)}`, 4);
});
```

### The trust boundary

The server keeps `onClient` handlers in a **separate table** from `on` handlers. A client-supplied event name can therefore never invoke a native or server-internal `on` handler — only handlers a script explicitly registered for client traffic. Two rules follow:

1. Treat every `onClient` payload as untrusted input. Validate the shape and range of everything before acting on it, and keep the accepted actions narrow.
2. Never take the acting player from the payload. The first handler argument is the `Player` resolved server-side from the actual connection; use that.

```js title="server/main.js" {3-4}
Events.onClient("mygm:vehicleToggle", (player, data) => {
  const accessory = data && data.accessory;
  // Whitelist, don't reflect: the payload chooses from options you offer.
  if (accessory !== "engine" && accessory !== "lights") return;

  const vehicle = player.getVehicle();
  if (!vehicle) return;
  accessory === "engine" ? vehicle.toggleEngine() : vehicle.toggleLights();
});
```

## Vetoable client events

Two client events are dispatched **synchronously**, just before the native behavior they announce. Returning `false` from a handler suppresses that behavior entirely:

- **`chatSend`** — fires when the player submits the chat input. Return `false` to swallow the line (for example to implement client-side command handling). `Chat.send(text)` bypasses this event.
- **`shopOpen`** — fires just before Mafia II's native city-shop menu opens. Returning `false` stops the menu before anything is drawn — the only clean way to replace it with a custom interface, since closing it afterwards would let the native menu flash in first. See [Shops and economy](/guides/shops-economy/).

```js title="client/main.js"
Events.on("shopOpen", (shop) => {
  if (!useCustomShopUi) return; // undefined = allow the native menu
  openMyShopInterface(shop.shopName);
  return false;                 // veto the native one
});
```

:::caution
Vetoes only work from synchronous handlers. An `async` handler (or one that returns a promise) cannot stop a synchronous native dispatch in time.
:::

## Lifecycle events

`resourceStart` and `resourceStop` are framework lifecycle events, fired once per resource in both environments, with the resource's name as the argument. Guard on your own name — they also fire for every other resource. Everything else in `EventMap` is specific to the selected M2O runtime; each entry's description states when native code dispatches it.
