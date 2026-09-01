---
title: Persistence patterns
sidebar:
  order: 11
---

# Persistence patterns

Everything the M2O server knows about a player is **session state**: money, weapons, position, collected pinups — all of it starts fresh when the player reconnects, and all of it is gone when the server restarts. The scripting API deliberately ships no database; the server entry runs in Node.js, so you bring whatever storage you like — a JSON file, SQLite, Postgres — and wire it into two hooks: *save on change, restore on connect*.

## The shape of the pattern

```js title="server/main.js"
// In-memory mirror of the store, keyed on a stable identity.
const profiles = new Map(); // steamId -> { money, collectedPinups }

Events.on("playerConnect", (player) => {
  const saved = profiles.get(player.steamId);
  if (!saved) return;

  // Re-apply everything the session forgot.
  player.addMoney(saved.money);
  for (const pinupId of saved.collectedPinups) {
    player.setPinupCollected(pinupId, true);
  }
});

Events.on("playerDisconnect", (player) => {
  profiles.set(player.steamId, {
    money: player.getMoney(),
    collectedPinups: player.collectedPinups,
  });
  // …and flush to disk / the database here or on a timer.
});
```

Swap the `Map` for real storage and the pattern is complete. Some practical notes:

- **Key on `player.steamId`**, not `nickname` (players rename) and not `player.id` (session-scoped, reused).
- **Save on the event that changes the data**, not only on disconnect — a crash loses everything since the last write. For low-churn data, writing in the event handler itself is simplest.
- **Restore in `playerConnect`.** It runs before the player has done anything, so re-applied state is in place for their whole session.

## Worked example: collectibles

Pinup magazines and wanted posters are native collectibles the server tracks per player — but only for the session. A player who picks one up, disconnects, and returns would see it available again unless you persist the set:

```js title="server/main.js"
Events.on("playerPinupCollected", (player, pinupId, galleryId) => {
  const kind = galleryId === 1 ? "wanted poster" : "magazine";
  player.addMoney(25);
  notify(player, `Found a ${kind}! ${player.collectedPinups.length} collected — $25 finder's fee.`);

  saveProfile(player); // save on change
});
```

The restore half is the `playerConnect` handler above: `player.setPinupCollected(pinupId, true)` for each saved id keeps already-taken collectibles hidden from that player. `player.isPinupCollected(id)` and `player.clearCollectedPinups()` round out the API.

## What not to persist

State the server replays to joining clients on its own does **not** belong in per-player storage: world time and weather, the [shop item registry](/guides/shops-economy/), blips and other [world entities](/guides/world-entities/), phone book entries. Recreate those once in `resourceStart` — every client, present and future, receives them automatically.

Server-wide state that must survive restarts (a leaderboard, faction treasuries, placed-entity layouts) uses the same save/restore pattern with `resourceStart` as the restore hook instead of `playerConnect`.

:::tip
Handles do not serialize. A `Player` or `Vehicle` object is a live wrapper around a network id — store plain data (ids, numbers, strings, arrays) and re-resolve handles after loading.
:::

## Async storage and event timing

Event handlers may be async, and native dispatch waits for them to settle — so an `async` `playerConnect` handler that awaits a database read before applying state is fine. Keep the await short: the player is already in the world while your handler runs. For heavier loads, apply critical state (money, team) first and stream the rest afterwards.
