---
title: Render2D
sidebar:
  order: 15
---

# Render2D

Render2D draws 2D interface elements — rectangles, text, textures — through the game's own native renderer. Compared to a [web view](/guides/web-views/), it costs no embedded browser, composites into the game's real UI layers (it can sit *under* the HUD or inside the phone screen), and uses the game's fonts and textures. It is the right tool for HUD-grade widgets: health bars, scoreboards, speedometers, subtitles.

## The model

Everything lives on a **canvas** bound to one of the game's UI layers. A canvas owns a tree of **nodes** — containers, rectangles, text, textures — with parent-relative positioning, optional clipping, and explicit z-order. Coordinates are **normalized screen fractions** (`0..1` on both axes), so a layout scales with resolution; colors are normalized `0..1` RGBA.

```js title="client/main.js"
if (!Render2D.isAvailable()) return;

const canvas = Render2D.createCanvas({ layer: "foreground" });

const panel = canvas.createContainer({
  position: new Vector2(0.06, 0.08),
  size: new Vector2(0.30, 0.14),
  clipping: true,
  clipRect: { left: 0, top: 0, right: 1, bottom: 1 },
});

canvas.createRectangle({
  parent: panel,
  position: new Vector2(0, 0),
  size: new Vector2(0.30, 0.14),
  color: new Color(0.025, 0.075, 0.13, 0.92),
});

const title = canvas.createText({
  parent: panel,
  text: "ROUND 3",
  position: new Vector2(0.02, 0.02),
  size: new Vector2(0.26, 0.05),
  font: "Futura",
  fontHeight: 0.035,
  color: new Color(0.95, 0.70, 0.18, 1),
});

canvas.createTexture({
  parent: panel,
  resource: "hud.dds",
  position: new Vector2(0.22, 0.03),
  size: new Vector2(0.06, 0.08),
  tint: new Color(1, 1, 1, 0.9),
});
```

Node positions are relative to their parent container, so moving `panel` moves everything inside it.

## Layers

`createCanvas({ layer })` picks where in the game's UI stack the canvas composites:

| Layer | Sits |
|:------|:-----|
| `foreground` | above everything — the default choice for game-mode UI |
| `hud` | with the native HUD (hidden and shown along with it) |
| `hudHints` | with hint text |
| `shopSubtitles` | with shop subtitles |
| `menus` | with native menus |
| `phone` | on the phone screen |
| `cutscene` | in cutscene presentation |

Placing a scoreboard on `hud` means `Hud.setVisible(false)` hides it too — usually exactly what you want.

## Updating and z-order

Creation options map to live properties — update nodes in place rather than rebuilding the tree:

```js title="client/main.js"
title.text = `ROUND ${round}`;
title.color = new Color(1, 0.3, 0.3, 1);
panel.position = new Vector2(0.06, 0.5);
panel.visible = false;
```

Siblings draw in creation order; rearrange with `node.moveBefore(sibling)`, `node.bringToFront()`, and `node.sendToBack()`. `node.setParent(container | null)` re-homes a node. Clipping is available per node (`clipping` + `clipRect`, in the node's own normalized space), which is how progress bars and scrolling lists crop their contents.

Text supports `fontStyle` (`normal`, `bold`, `italic`, `boldItalic`), `fontScale`, `widthLimit` for wrapping, `kerning`, and `horizontalAlign`/`verticalAlign`.

## A dynamic example: a health bar over a world position

```js title="client/main.js"
const bar = canvas.createRectangle({
  size: new Vector2(0.06, 0.008),
  color: new Color(0.2, 0.9, 0.3, 1),
});

setInterval(() => {
  const lp = LocalPlayer;
  if (!lp) return;
  const head = lp.getBoneTransform(Bone.Head);
  if (!head) return;
  const s = Camera.worldToScreen(head.position.x, head.position.y, head.position.z + 0.3);
  bar.visible = s.visible;
  if (s.visible) {
    const { width, height } = Web.getScreenSize();
    bar.position = new Vector2(s.x / width - 0.03, s.y / height);
  }
}, 16);
```

`Camera.worldToScreen` returns pixels; divide by the screen size to get Render2D's normalized coordinates.

## Lifecycle and cleanup

```js title="client/main.js"
canvas.clear();        // remove every node, keep the canvas
canvas.destroy();      // remove the canvas and its tree
Render2D.destroyAll(); // remove every canvas this resource created

Events.on("resourceStop", (resourceName) => {
  if (resourceName !== "my-gamemode") return;
  if (canvas && !canvas.destroyed) canvas.destroy();
});
```

Creation calls return `null` when a node cannot be created — check the return values when building larger trees, and destroy the canvas on failure rather than leaving a half-built UI:

```js title="client/main.js"
const label = canvas.createText({ text: "…", position: new Vector2(0, 0) });
if (!label) {
  canvas.destroy();
  return;
}
```

:::tip
Guard everything behind `Render2D.isAvailable()` — the renderer is unavailable in some contexts, and a game mode should degrade (or fall back to a web view) rather than throw.
:::
