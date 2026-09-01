---
title: Shops and economy
sidebar:
  order: 10
---

# Shops and economy

Mafia II's city shops — gunshops, bars, clothes stores — work in multiplayer, but with the single-player purchase logic deliberately cut out. What remains is a clean split: **the client runs the shop experience, the server owns the items and the money.** Understanding that split is most of this guide.

## Money

The server is the only authority on a player's balance:

```js title="server/main.js"
player.addMoney(50);
player.removeMoney(25);
const balance = player.getMoney();
```

The balance is synced to the owning client, where the native HUD cash counter displays it. Nothing client-side can change it.

## How a purchase flows

1. The player walks into a shop trigger. **`playerShopEnter`** fires with the shop name, its internal script path, whether the native menu actually opened (`nativeOpened`), and the trigger source.
2. If the native menu opened, **`playerShopOpen`** fires. The `shopName` here is the friendly configuration name (e.g. `"Gunshop"`, `"Deli bar"`) — the same name the item registry and the client's `Shop.open` use.
3. The player buys an item. The item is granted natively on the client — but *nothing is charged there*, because the single-player purchase handler is disabled. Instead **`playerShopBuy`** fires server-side, and charging is your job:

```js title="server/main.js"
Events.on("playerShopBuy", (player, shopName, itemIndex, weaponId, price, secondary) => {
  if (price <= 0) return;

  const balance = player.getMoney();
  if (balance < price) {
    // The native menu gates on the synced balance, so this means the
    // client lied or drifted — log it, and consider it a red flag.
    console.warn(`${player.nickname} bought $${price} with only $${balance}`);
  }
  player.removeMoney(price);
  notify(player, `Purchased for $${price.toFixed(2)} — balance $${player.getMoney().toFixed(2)}.`);
});
```

`secondary` is `true` when the purchase was ammo for a weapon rather than the item itself.

4. Closing the menu fires **`playerShopClose`** with a native close-reason code (`2` = the player left or pressed ESC, `3` = closed by a buy).

:::caution
Skipping the `playerShopBuy` handler gives everyone free shopping — the native flow happily grants items and never charges. If your game mode uses money at all, this handler is mandatory.
:::

## The item registry

The server can override any shop's item slots globally with the replicated `Shop` registry. Overrides apply to every player — including a menu that is already open, and late joiners:

```js title="server/main.js"
// Shop.setItem(shopName, slotIndex, enabled, visible?, price?, ammoPrice?)
Shop.setItem("Gunshop", 3, true, true, 250);   // reprice slot 3 to $250
Shop.setItem("Gunshop", 7, false);             // disable slot 7
Shop.clearItem("Gunshop", 3);                  // back to the retail default
Shop.getItems();                               // every active override
```

Slot indexes are positions in the shop's retail item layout. Disabled slots grey out in the native menu; invisible ones disappear.

## Opening and closing programmatically

The menu itself is client-side, so the server asks for it with an [intent](/guides/ui-architecture/):

```js title="client/main.js"
CLIENT_CALLS["shop.open"]  = (a) => Shop.open(a.shopName);  // must be streamed in
CLIENT_CALLS["shop.close"] = ()  => Shop.close();
```

`Shop.open(shopName)` only works for a shop whose trigger area has streamed in — the player needs to be near it.

## Replacing a shop with your own UI

To swap the native menu for a custom interface (a [web view](/guides/web-views/), say), veto the **synchronous** client `shopOpen` event. This stops the menu *before anything is drawn* — calling `Shop.close()` afterwards is too late, the native menu is already fading in:

```js title="client/main.js"
Events.on("shopOpen", (shop) => {
  console.log(`shopOpen: ${shop.shopName} (source=${shop.source})`);
  openCustomShop(shop.shopName);
  return false;                 // suppress the native menu
});
```

Server-side, a vetoed open still fires `playerShopEnter` with `nativeOpened === false` — so the server always knows the player is at a shop, whichever interface handles it. From there, your custom UI's purchases flow through your own [client events](/guides/events/#crossing-the-network), with the same server-side charging discipline as above.

## Jukeboxes

The shops' seven native jukeboxes are wired too: a player dropping a coin fires `jukeboxUse(player, jukeboxId)` server-side, with the track already rolled. `Jukebox.getState(jukeboxId)` reads what is playing (`slot`, `playing`, `seed`, `elapsed`), and `Jukebox.playSong(jukeboxId, seed?)` / `Jukebox.stop(jukeboxId)` drive one directly.

## The telephone

The `PhoneBook` registry mirrors onto every client's native dial menu at in-world phone booths. Dialing raises a server event:

```js title="server/main.js"
PhoneBook.addNumber(1234, "Taxi");
PhoneBook.addNumber(911, "Emergency");

Events.on("playerDialNumber", (player, number, name, cost) => {
  if (number === 1234) {
    // dispatch a taxi…
  }
});
```

`addNumber` optionally takes a text id, a call cost, and a type; `removeNumber`, `has`, `clear`, and `getNumbers` manage the book.
