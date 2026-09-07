---
title: Weapon damage
sidebar:
  order: 7.5
---

# Weapon damage

Every weapon in Mafia II ships with a fixed damage curve. The `Weapon` global lets a server scale that curve per weapon ID, so a game mode can tone down the guns that decide a fight too quickly or make a pistol duel last longer. The scale applies to everyone on the server, takes effect within a moment, and covers bullets, blasts, and melee swings.

## Scaling a weapon

`Weapon.setDamageMultiplier(weaponId, factor)` takes an ID from the [weapon catalog](/guides/catalogs/weapons/) and a factor between `0` and `100`. `1` is the retail value, `0.5` halves every hit, `0` makes the weapon harmless.

```js title="server/main.js"
Weapon.setDamageMultiplier(14, 0.5); // MG42 at half damage
Weapon.setDamageMultiplier(6, 0.75); // Model 19 Revolver at three quarters
Weapon.setDamageMultiplier(20, 0.25); // Mk II Grenade at a quarter
```

The change reaches every connected client and every player who joins later. `Weapon.getDamageMultiplier(weaponId)` reads the current factor, and `Weapon.resetDamage(weaponId)` puts one weapon back to retail. Calling `Weapon.resetDamage()` with no argument restores all of them.

The call throws for a weapon without adjustable damage and for a factor outside `0..100`, so wrap it when the ID comes from player input.

## A balance table

Most game modes want the same numbers every time the server starts. Keep them in one object and apply it on startup:

```js title="server/balance.js"
export const WEAPON_BALANCE = {
  6: 0.8, // Model 19 Revolver
  9: 0.7, // M3 Grease Gun
  14: 0.4, // MG42
  17: 0.85, // Kar98k
  20: 0.5, // Mk II Grenade
};

export function applyWeaponBalance() {
  Weapon.resetDamage();
  for (const [id, factor] of Object.entries(WEAPON_BALANCE)) {
    Weapon.setDamageMultiplier(Number(id), factor);
  }
}
```

```js title="server/main.js"
import { applyWeaponBalance } from "./balance.js";

applyWeaponBalance();
```

Because the table lives on the server, a client cannot opt out of it. The server also rejects any hit report whose power exceeds the scaled retail value for that weapon, so raising a weapon's damage on a modified client has no effect.

## Tuning live from chat

A `/weapon damage` command lets a tester try values without restarting. It mirrors the one shipped in the demo game mode:

```js title="server/main.js"
Events.on("playerCommand", (player, command, args) => {
  if (command !== "weapondmg") return;

  const id = Number(args[0]);
  const factor = Number(args[1]);
  if (!Number.isInteger(id) || !Number.isFinite(factor)) {
    return notify(player, "Usage: /weapondmg <weaponId> <factor>");
  }

  try {
    Weapon.setDamageMultiplier(id, factor);
  } catch (err) {
    return notify(player, err.message);
  }
  notify(player, `Weapon ${id} now deals x${factor} damage for everyone.`);
});
```

`notify()` is the HUD feedback helper from [Server, client, and the UI](/guides/concepts/ui-architecture/).

## What the factor scales

Each firearm and explosive carries three power values and three distances: full power up to the first distance, a lower value at the second, a lower one again at the third, and nothing beyond it. `Weapon.getBaseDamage(weaponId)` returns that retail curve as `{ near, mid, far, range1, range2, maxRange }`, or `null` for melee weapons and unknown IDs.

```js title="server/main.js"
const colt = Weapon.getBaseDamage(4);
// { near: 90, mid: 65, far: 40, range1: 4, range2: 30, maxRange: 200 }
```

The factor multiplies the three power values and leaves the distances alone, so a scaled weapon keeps its retail falloff shape. A player has 720 health, and a headshot multiplies the hit by 1.44 on top of the curve.

| ID | Weapon | Near | Mid | Far | Distances (m) |
| --- | --- | --- | --- | --- | --- |
| 2 | Model 12 Revolver | 80 | 55 | 40 | 4 / 25 / 200 |
| 3 | Mauser C96 | 80 | 55 | 40 | 4 / 25 / 200 |
| 4 | Colt M1911A1 | 90 | 65 | 40 | 4 / 30 / 200 |
| 5 | Colt M1911 Special | 90 | 65 | 40 | 4 / 30 / 200 |
| 6 | Model 19 Revolver | 125 | 125 | 90 | 4 / 20 / 200 |
| 8 | Remington 870 Field Gun | 57 | 45 | 35 | 6 / 18 / 100 |
| 9 | M3 Grease Gun | 125 | 90 | 55 | 5 / 35 / 200 |
| 10 | MP40 | 70 | 50 | 32 | 5 / 25 / 100 |
| 11 | Thompson 1928 | 70 | 57 | 37 | 5 / 30 / 100 |
| 12 | M1A1 Thompson | 70 | 57 | 37 | 5 / 30 / 100 |
| 13 | Beretta Model 38A | 60 | 57 | 35 | 5 / 25 / 100 |
| 14 | MG42 | 240 | 230 | 220 | 20 / 80 / 200 |
| 15 | M1 Garand | 105 | 105 | 72 | 15 / 50 / 300 |
| 17 | Kar98k | 125 | 120 | 110 | 30 / 60 / 300 |
| 18 | Mauser 98k Sniper | 100 | 80 | 60 | 100 / 200 / 300 |
| 16 | Stielhandgranate 24 | 75 | 50 | 25 | 5 / 10 / 15 |
| 20 | Mk II Grenade | 250 | 200 | 150 | 3 / 6 / 6 |
| 21 | Molotov Cocktail | 100 | 75 | 50 | 3 / 4 / 7 |

The shotgun value is per pellet. For grenades and the Molotov the distances are the blast radius bands rather than a bullet's travel.

Melee weapons have no curve of their own: the factor scales the swing damage of that weapon ID directly, and fists cannot be adjusted.

:::note
Power also decides how far a bullet carries through cover. A weapon scaled up penetrates more material, and one scaled down penetrates less, exactly as the stronger and weaker retail guns do.
:::

:::tip
Shots already in flight keep the value they were fired with. Change the table between rounds, or accept that the first hits after a change may still land at the old scale.
:::

## Reading the result

The `playerDamage` event on the [player lifecycle](/guides/server/player-lifecycle/) page reports `power` as the value the shooter's weapon produced after scaling, so a hitmarker or damage-number script sees the tuned numbers without any extra work.
