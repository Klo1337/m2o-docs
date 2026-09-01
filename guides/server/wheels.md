---
title: Vehicle wheels
sidebar:
  order: 19
---

# Vehicle wheel models

Mafia II vehicles can replace the model used by each wheel group. The M2O scripting API identifies each available wheel model by its exact name.

Wheel model changes are authoritative server operations. M2O stores the selected model on the vehicle and replicates it to connected players, including players who stream the vehicle in later.

## Changing wheels on the server

Call `Vehicle.setWheelModel(group, modelName)` from a server resource. Group `0` controls the front axle, group `1` controls the rear axle, and group `2` controls the spare wheel.

```js
Events.on("playerCommand", (player, command) => {
  if (command !== "sportwheels") return;

  const vehicle = player.getVehicle();
  if (!vehicle) {
    Chat.sendToPlayer(player, "Enter a vehicle first.");
    return;
  }

  vehicle.setWheelModel(0, "wheel_sport"); // Front axle
  vehicle.setWheelModel(1, "wheel_sport"); // Rear axle
});
```

Pass an empty model name to restore the vehicle's default wheel for that group. `Vehicle.getWheelModel(group)` returns the stored override. Wheel damage is separate: use `Vehicle.setWheelState(index, VehicleWheelState.Deflated)` or `VehicleWheelState.BlownOut` when changing tyre condition.

## Available wheel models

| Model name | Preview |
|:-----------|:--------|
| `wheel_civ01` | <img src="./wheels/0.png" alt="Wheel model wheel_civ01" loading="lazy"> |
| `wheel_civ02` | <img src="./wheels/1.png" alt="Wheel model wheel_civ02" loading="lazy"> |
| `wheel_civ03` | <img src="./wheels/2.png" alt="Wheel model wheel_civ03" loading="lazy"> |
| `wheel_civ04` | <img src="./wheels/3.png" alt="Wheel model wheel_civ04" loading="lazy"> |
| `wheel_civ05` | <img src="./wheels/4.png" alt="Wheel model wheel_civ05" loading="lazy"> |
| `wheel_civ06` | <img src="./wheels/5.png" alt="Wheel model wheel_civ06" loading="lazy"> |
| `wheel_civ07` | <img src="./wheels/6.png" alt="Wheel model wheel_civ07" loading="lazy"> |
| `wheel_civ08` | <img src="./wheels/7.png" alt="Wheel model wheel_civ08" loading="lazy"> |
| `wheel_civ09` | <img src="./wheels/8.png" alt="Wheel model wheel_civ09" loading="lazy"> |
| `wheel_civ10` | <img src="./wheels/9.png" alt="Wheel model wheel_civ10" loading="lazy"> |
| `wheel_civ11` | <img src="./wheels/10.png" alt="Wheel model wheel_civ11" loading="lazy"> |
| `wheel_civ09_hot` | <img src="./wheels/11.png" alt="Wheel model wheel_civ09_hot" loading="lazy"> |
| `wheel_civ11_hot` | <img src="./wheels/12.png" alt="Wheel model wheel_civ11_hot" loading="lazy"> |
| `wheel_sport` | <img src="./wheels/13.png" alt="Wheel model wheel_sport" loading="lazy"> |
| `wheel_jeep` | <img src="./wheels/14.png" alt="Wheel model wheel_jeep" loading="lazy"> |
| `wheel_hank_f` | <img src="./wheels/15.png" alt="Wheel model wheel_hank_f" loading="lazy"> |
| `wheel_hank_r` | <img src="./wheels/16.png" alt="Wheel model wheel_hank_r" loading="lazy"> |
| `wheel_truckciv01` | <img src="./wheels/17.png" alt="Wheel model wheel_truckciv01" loading="lazy"> |
| `wheel_truckciv02` | <img src="./wheels/18.png" alt="Wheel model wheel_truckciv02" loading="lazy"> |
