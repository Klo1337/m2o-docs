---
title: Seasons
group: Guides
---

# Seasons

Every M2O server runs in one of two seasons: `summer` or `winter`. The season is part of the server's configuration rather than something a script changes at runtime, and every player who connects sees the same one.

## Configuration

Set `season` inside the `mod` object of `server.json`:

```json
{
  "host": "0.0.0.0",
  "port": 27015,
  "maxplayers": 32,
  "mod": {
    "season": "winter"
  }
}
```

| Value | Result |
|:------|:-------|
| `summer` | Empire Bay as it appears in Free Ride. This is the default. |
| `winter` | Empire Bay under snow, with the matching winter environment. |

If the key is absent the server runs `summer`. Any other value is rejected when the server starts, with an error naming the key, so a typo fails immediately instead of producing a half-applied world.

## What the season affects

The season is applied before a connecting player's world finishes loading, so it is in place from the first frame rather than being swapped in afterwards. It covers:

- the city environment, including snow cover and the matching lighting and ambience;
- vehicles, which spawn in their winter appearance when the game provides one for that model, and in their normal appearance when it does not;
- the default weather presentation for the world.

No scripting changes are needed to support either season. A game mode that never mentions the season works on both.

## Seasons and weather

Weather templates belong to a season. The [Weather](./weather.md) guide lists them in separate **Summer** and **Winter** tables, and a server should only select templates from the table matching its own season.

Selecting a template from the other season produces a world that does not agree with itself — most visibly, the ground stops rendering correctly. M2O will not display such a combination: a mismatched template is replaced with the season's default and a warning is written to the client log naming the template that was requested. Weather still works normally as long as the template comes from the right table.

```js
// On a server configured with "season": "winter".
World.setWeather("DTFreeRideDayWinter"); // applied
World.setWeather("DTFreeRideDayRain");   // summer template, replaced by the winter default
```

`World.setTime()` and `World.setRainIntensity()` are unaffected by the season and behave the same in both.

## Changing the season

The season is fixed for the lifetime of the server process. Edit `server.json` and restart the server to change it; players then connect into the new season.
