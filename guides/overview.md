---
title: Overview
sidebar:
  order: 1
---

M2O resources run JavaScript in one of two environments:

- **Server resources** run in Node.js and own authoritative game state — players, vehicles, world, money.
- **Client resources** run in a sandboxed V8 context on each player's machine and control local presentation and input — HUD, key binds, web views, the camera.

Use the navigation to browse the globals available to the selected environment. The same declarations that generate this reference can be loaded by an editor for autocomplete and type checking.

## Server example

```js
Events.on("playerConnect", (player) => {
  // HUD text is local to the owning client: send an intent and let the client draw it.
  player.emit("mygm:welcome", JSON.stringify({ text: `Welcome, ${player.nickname}`, seconds: 5 }));

  const spawn = new Vector3(250, 120, 0);
  const vehicle = Vehicle.spawn(32, spawn);
  vehicle.setColor(140, 20, 20);
});
```

## Client example

```js
Events.on("mygm:welcome", (data) => {
  Hud.showMessage(data.text, data.seconds);
});

Key.bind("f6", () => {
  Hud.setVisible(!Hud.isVisible());
});

const player = LocalPlayer;
if (player) {
  const screen = Camera.worldToScreen(player.position.x, player.position.y, player.position.z);
  console.log(screen.x, screen.y, screen.visible);
}
```

:::caution
Server and client declarations must be loaded separately. A global shown in one environment is not automatically available in the other.
:::

## Finding your way

**Start here:**

- [Your first resource](/guides/getting-started/) — the manifest, entry points, and sharing code between resources.
- [Running a server](/guides/server-setup/) — `server.json`, ports, and hosting.

**The two ideas everything builds on:**

- [Events](/guides/events/) — listeners, the client↔server bridge, and the trust boundary.
- [Server, client, and the UI](/guides/ui-architecture/) — why UI is client-side and the intent pattern that follows.

**Server-side systems:** [chat and commands](/guides/chat-commands/), the [player lifecycle](/guides/player-lifecycle/), [vehicles](/guides/vehicles/), [world entities and triggers](/guides/world-entities/), [shops and economy](/guides/shops-economy/), [persistence](/guides/persistence/), and [seasons](/guides/seasons/).

**Client-side systems:** the [HUD and native UI](/guides/hud/), [input and controls](/guides/input-controls/), [Render2D](/guides/render2d/), and [web views](/guides/web-views/).

**Illustrated catalogs:** [weapon IDs](/guides/weapons/), [map blip icons](/guides/map-blips/), [vehicle wheel models](/guides/wheels/), and [weather templates](/guides/weather/).
