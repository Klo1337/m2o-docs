---
title: Events
group: Guides
---

# Events

M2O scripts receive framework and game events through `Events`. Use `on` for a persistent listener, `once` for a one-shot listener, and the unsubscribe function returned by `on` when the listener is no longer needed. Event handlers belong to the resource that registered them and may return promises; native dispatch waits for all matching handlers to settle.

```ts
const unsubscribe = Events.on("resourceStart", (resourceName) => {
  console.log(`${resourceName} started`);
});

// Later:
unsubscribe();
```

The generated {@link EventMap} is the authoritative list for the selected client or server environment. Each property type is the callback's argument tuple, and {@link EventName} is the union of its property names. Descriptions state when native code dispatches the event.

Script-defined events are intentionally open-ended and are not part of `EventMap`. `emit`, `emitTo`, and `emitLocal` carry arbitrary resource-defined arguments. Client-to-server events use `emitServer` and `onClient`; the server keeps those handlers in a separate trust-boundary table so a client-supplied name cannot invoke a native or shared `on` handler. Server-to-client events sent with `emitAllClients` arrive in the client's shared `on` table.

`resourceStart` and `resourceStop` are framework lifecycle events. The remaining entries are specific to the selected M2O runtime. Client and server maps differ because an event is only listed where it is actually dispatched.
