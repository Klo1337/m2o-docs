---
title: Overview
group: Guides
---

M2O resources run JavaScript in one of two environments:

- **Server resources** run in Node.js and own authoritative game state.
- **Client resources** run in a sandboxed V8 context and control local presentation and input.

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

> Server and client declarations must be loaded separately. A global shown in one environment is not automatically available in the other.
