---
title: Weather
group: Resources
---

# Weather templates

Mafia II weather is selected by template name rather than a numeric ID. Each template combines sky, lighting, fog, precipitation, and seasonal presentation for a particular time of day.

Weather is authoritative server state. `World.setWeather()` replicates the selected template to connected players, while `World.setTime()` controls the synchronized clock independently.

## Setting weather on the server

```js
// Clear summer weather at 08:15.
World.setWeather("DTFreeRideDay");
World.setTime(8, 15);

// Optional: force rain intensity from 0 through 100.
World.setRainIntensity(35);
```

Pass the exact, case-sensitive template name shown below. Use `World.getWeather()` to read the active template. A negative rain intensity disables the override and returns control to the template itself.

The normalized game-time value ranges from `0` at midnight to `0.5` at noon. The clock column is the same value converted into hours and minutes for use with `World.setTime(hour, minute)`.

## Summer

| Template | Game time | Clock | Conditions | Preview |
|:---------|----------:|:-----:|:----------:|:--------|
| `DT_RTRclear_day_night` | 0.000 | 00:00 | Clear | <img src="./weather/summer/DT_RTRclear_day_night.png" alt="Weather preset DT_RTRclear_day_night" loading="lazy"> |
| `DTFreerideNight` | 0.000 | 00:00 | Clear | <img src="./weather/summer/DTFreerideNight.png" alt="Weather preset DTFreerideNight" loading="lazy"> |
| `DT07part04night_bordel` | 0.000 | 00:01 | Clear | <img src="./weather/summer/DT07part04night_bordel.png" alt="Weather preset DT07part04night_bordel" loading="lazy"> |
| `DT11part01` | 0.294316 | 07:07 | Foggy | <img src="./weather/summer/DT11part01.png" alt="Weather preset DT11part01" loading="lazy"> |
| `DT_RTRfoggy_day_morning` | 0.310024 | 07:30 | Foggy | <img src="./weather/summer/DT_RTRfoggy_day_morning.png" alt="Weather preset DT_RTRfoggy_day_morning" loading="lazy"> |
| `DT_RTRfoggy_day_early_morn1` | 0.313921 | 07:34 | Foggy | <img src="./weather/summer/DT_RTRfoggy_day_early_morn1.png" alt="Weather preset DT_RTRfoggy_day_early_morn1" loading="lazy"> |
| `DT_RTRclear_day_early_morn1` | 0.320318 | 07:44 | Clear | <img src="./weather/summer/DT_RTRclear_day_early_morn1.png" alt="Weather preset DT_RTRclear_day_early_morn1" loading="lazy"> |
| `DT_RTRrainy_day_early_morn` | 0.328117 | 07:56 | Raining | <img src="./weather/summer/DT_RTRrainy_day_early_morn.png" alt="Weather preset DT_RTRrainy_day_early_morn" loading="lazy"> |
| `DT07part01fromprison` | 0.338523 | 08:10 | Clear | <img src="./weather/summer/DT07part01fromprison.png" alt="Weather preset DT07part01fromprison" loading="lazy"> |
| `DTFreeRideDay` | 0.341236 | 08:15 | Clear | <img src="./weather/summer/DTFreeRideDay.png" alt="Weather preset DTFreeRideDay" loading="lazy"> |
| `DTFreeRideDayRain` | 0.341018 | 08:15 | Raining | <img src="./weather/summer/DTFreeRideDayRain.png" alt="Weather preset DTFreeRideDayRain" loading="lazy"> |
| `DT_RTRclear_day_early_morn2` | 0.346315 | 08:22 | Clear | <img src="./weather/summer/DT_RTRclear_day_early_morn2.png" alt="Weather preset DT_RTRclear_day_early_morn2" loading="lazy"> |
| `DT06part03` | 0.348216 | 08:25 | Clear | <img src="./weather/summer/DT06part03.png" alt="Weather preset DT06part03" loading="lazy"> |
| `DT_RTRrainy_day_morning` | 0.362028 | 08:45 | Raining | <img src="./weather/summer/DT_RTRrainy_day_morning.png" alt="Weather preset DT_RTRrainy_day_morning" loading="lazy"> |
| `DT06part02` | 0.397121 | 09:36 | Foggy | <img src="./weather/summer/DT06part02.png" alt="Weather preset DT06part02" loading="lazy"> |
| `DT13part01death` | 0.403714 | 09:45 | Clear | <img src="./weather/summer/DT13part01death.png" alt="Weather preset DT13part01death" loading="lazy"> |
| `DT_RTRclear_day_morning` | 0.416776 | 10:03 | Clear | <img src="./weather/summer/DT_RTRclear_day_morning.png" alt="Weather preset DT_RTRclear_day_morning" loading="lazy"> |
| `DT09part1VitosFlat` | 0.416817 | 10:03 | Clear | <img src="./weather/summer/DT09part1VitosFlat.png" alt="Weather preset DT09part1VitosFlat" loading="lazy"> |
| `DT06part01` | 0.422942 | 10:12 | Raining | <img src="./weather/summer/DT06part01.png" alt="Weather preset DT06part01" loading="lazy"> |
| `DT11part02` | 0.424717 | 10:15 | Foggy | <img src="./weather/summer/DT11part02.png" alt="Weather preset DT11part02" loading="lazy"> |
| `DT08part01cigarettesriver` | 0.447927 | 10:48 | Clear | <img src="./weather/summer/DT08part01cigarettesriver.png" alt="Weather preset DT08part01cigarettesriver" loading="lazy"> |
| `DT09part2MalteseFalcone` | 0.482623 | 11:39 | Clear | <img src="./weather/summer/DT09part2MalteseFalcone.png" alt="Weather preset DT09part2MalteseFalcone" loading="lazy"> |
| `DT_RTRclear_day_noon` | 0.489940 | 11:49 | Clear | <img src="./weather/summer/DT_RTRclear_day_noon.png" alt="Weather preset DT_RTRclear_day_noon" loading="lazy"> |
| `DT_RTRfoggy_day_noon` | 0.490646 | 11:51 | Foggy | <img src="./weather/summer/DT_RTRfoggy_day_noon.png" alt="Weather preset DT_RTRfoggy_day_noon" loading="lazy"> |
| `DT14part1_6` | 0.505515 | 12:12 | Clear | <img src="./weather/summer/DT14part1_6.png" alt="Weather preset DT14part1_6" loading="lazy"> |
| `DT15` | 0.510414 | 12:20 | Raining | <img src="./weather/summer/DT15.png" alt="Weather preset DT15" loading="lazy"> |
| `DT15end` | 0.510413 | 12:20 | Raining | <img src="./weather/summer/DT15end.png" alt="Weather preset DT15end" loading="lazy"> |
| `DT_RTRrainy_day_noon` | 0.518224 | 12:31 | Raining | <img src="./weather/summer/DT_RTRrainy_day_noon.png" alt="Weather preset DT_RTRrainy_day_noon" loading="lazy"> |
| `DT15_interier` | 0.518815 | 12:31 | Foggy | <img src="./weather/summer/DT15_interier.png" alt="Weather preset DT15_interier" loading="lazy"> |
| `DT07part02dereksubquest` | 0.528755 | 12:46 | Clear | <img src="./weather/summer/DT07part02dereksubquest.png" alt="Weather preset DT07part02dereksubquest" loading="lazy"> |
| `DT_RTRfoggy_day_afternoon` | 0.565219 | 13:39 | Foggy | <img src="./weather/summer/DT_RTRfoggy_day_afternoon.png" alt="Weather preset DT_RTRfoggy_day_afternoon" loading="lazy"> |
| `DT10part02Roof` | 0.567719 | 13:42 | Clear | <img src="./weather/summer/DT10part02Roof.png" alt="Weather preset DT10part02Roof" loading="lazy"> |
| `DT08part02cigarettesmill` | 0.576539 | 13:55 | Clear | <img src="./weather/summer/DT08part02cigarettesmill.png" alt="Weather preset DT08part02cigarettesmill" loading="lazy"> |
| `DT09part3SlaughterHouseAfter` | 0.578222 | 13:58 | Clear | <img src="./weather/summer/DT09part3SlaughterHouseAfter.png" alt="Weather preset DT09part3SlaughterHouseAfter" loading="lazy"> |
| `DT12_part_all` | 0.588315 | 14:13 | Clear | <img src="./weather/summer/DT12_part_all.png" alt="Weather preset DT12_part_all" loading="lazy"> |
| `DT13part02` | 0.588514 | 14:13 | Clear | <img src="./weather/summer/DT13part02.png" alt="Weather preset DT13part02" loading="lazy"> |
| `DT01part01sicily_svit` | 0.593820 | 14:20 | Clear | <img src="./weather/summer/DT01part01sicily_svit.png" alt="Weather preset DT01part01sicily_svit" loading="lazy"> |
| `DT_RTRrainy_day_afternoon` | 0.595024 | 14:23 | Raining | <img src="./weather/summer/DT_RTRrainy_day_afternoon.png" alt="Weather preset DT_RTRrainy_day_afternoon" loading="lazy"> |
| `DT09part4MalteseFalcone2` | 0.600717 | 14:30 | Clear | <img src="./weather/summer/DT09part4MalteseFalcone2.png" alt="Weather preset DT09part4MalteseFalcone2" loading="lazy"> |
| `DT_RTRclear_day_afternoon` | 0.632987 | 15:16 | Clear | <img src="./weather/summer/DT_RTRclear_day_afternoon.png" alt="Weather preset DT_RTRclear_day_afternoon" loading="lazy"> |
| `DT11part03` | 0.648526 | 15:40 | Raining | <img src="./weather/summer/DT11part03.png" alt="Weather preset DT11part03" loading="lazy"> |
| `DT_RTRfoggy_day_late_afternoon` | 0.725421 | 17:31 | Foggy | <img src="./weather/summer/DT_RTRfoggy_day_late_afternoon.png" alt="Weather preset DT_RTRfoggy_day_late_afternoon" loading="lazy"> |
| `DT_RTRclear_day_late_afternoon` | 0.734423 | 17:44 | Clear | <img src="./weather/summer/DT_RTRclear_day_late_afternoon.png" alt="Weather preset DT_RTRclear_day_late_afternoon" loading="lazy"> |
| `DT_RTRrainy_day_late_afternoon` | 0.734415 | 17:44 | Raining | <img src="./weather/summer/DT_RTRrainy_day_late_afternoon.png" alt="Weather preset DT_RTRrainy_day_late_afternoon" loading="lazy"> |
| `DT14part7_10` | 0.739513 | 17:52 | Clear | <img src="./weather/summer/DT14part7_10.png" alt="Weather preset DT14part7_10" loading="lazy"> |
| `DT07part03prepadrestaurcie` | 0.744817 | 17:59 | Clear | <img src="./weather/summer/DT07part03prepadrestaurcie.png" alt="Weather preset DT07part03prepadrestaurcie" loading="lazy"> |
| `DT_RTRrainy_day_evening` | 0.750026 | 18:07 | Raining | <img src="./weather/summer/DT_RTRrainy_day_evening.png" alt="Weather preset DT_RTRrainy_day_evening" loading="lazy"> |
| `DT10part03Evening` | 0.757914 | 18:18 | Clear | <img src="./weather/summer/DT10part03Evening.png" alt="Weather preset DT10part03Evening" loading="lazy"> |
| `DT_RTRfoggy_day_evening` | 0.794544 | 19:11 | Foggy | <img src="./weather/summer/DT_RTRfoggy_day_evening.png" alt="Weather preset DT_RTRfoggy_day_evening" loading="lazy"> |
| `DT08part03crazyhorse` | 0.797021 | 19:16 | Clear | <img src="./weather/summer/DT08part03crazyhorse.png" alt="Weather preset DT08part03crazyhorse" loading="lazy"> |
| `DT08part04subquestwarning` | 0.804712 | 19:26 | Clear | <img src="./weather/summer/DT08part04subquestwarning.png" alt="Weather preset DT08part04subquestwarning" loading="lazy"> |
| `DT11part04` | 0.808127 | 19:32 | Raining | <img src="./weather/summer/DT11part04.png" alt="Weather preset DT11part04" loading="lazy"> |
| `DT_RTRclear_day_evening` | 0.812517 | 19:37 | Clear | <img src="./weather/summer/DT_RTRclear_day_evening.png" alt="Weather preset DT_RTRclear_day_evening" loading="lazy"> |
| `DT_RTRclear_day_late_even` | 0.843816 | 20:22 | Clear | <img src="./weather/summer/DT_RTRclear_day_late_even.png" alt="Weather preset DT_RTRclear_day_late_even" loading="lazy"> |
| `DT_RTRfoggy_day_night` | 0.846320 | 20:27 | Foggy | <img src="./weather/summer/DT_RTRfoggy_day_night.png" alt="Weather preset DT_RTRfoggy_day_night" loading="lazy"> |
| `DT_RTRfoggy_day_late_even` | 0.847344 | 20:28 | Foggy | <img src="./weather/summer/DT_RTRfoggy_day_late_even.png" alt="Weather preset DT_RTRfoggy_day_late_even" loading="lazy"> |
| `DT_RTRrainy_day_late_even` | 0.851615 | 20:34 | Raining | <img src="./weather/summer/DT_RTRrainy_day_late_even.png" alt="Weather preset DT_RTRrainy_day_late_even" loading="lazy"> |
| `DT10part02bSUNOFF` | 0.875042 | 21:09 | Clear | <img src="./weather/summer/DT10part02bSUNOFF.png" alt="Weather preset DT10part02bSUNOFF" loading="lazy"> |
| `DT10part03Subquest` | 0.878615 | 21:13 | Foggy | <img src="./weather/summer/DT10part03Subquest.png" alt="Weather preset DT10part03Subquest" loading="lazy"> |
| `DT01part02sicily` | 0.911616 | 22:01 | Foggy | <img src="./weather/summer/DT01part02sicily.png" alt="Weather preset DT01part02sicily" loading="lazy"> |
| `DT14part11` | 0.929721 | 22:27 | Clear | <img src="./weather/summer/DT14part11.png" alt="Weather preset DT14part11" loading="lazy"> |
| `DT_RTRrainy_day_night` | 0.947977 | 22:53 | Raining | <img src="./weather/summer/DT_RTRrainy_day_night.png" alt="Weather preset DT_RTRrainy_day_night" loading="lazy"> |
| `DT11part05` | 0.971315 | 23:28 | Clear | <img src="./weather/summer/DT11part05.png" alt="Weather preset DT11part05" loading="lazy"> |

## Winter

| Template | Game time | Clock | Conditions | Preview |
|:---------|----------:|:-----:|:----------:|:--------|
| `DTFreeRideNightSnow` | 0.000 | 00:00 | Clear | <img src="./weather/winter/DTFreeRideNightSnow.png" alt="Weather preset DTFreeRideNightSnow" loading="lazy"> |
| `DTFreeRideDaySnow` | 0.341014 | 08:15 | Clear | <img src="./weather/winter/DTFreeRideDaySnow.png" alt="Weather preset DTFreeRideDaySnow" loading="lazy"> |
| `DT05part01JoesFlat` | 0.375915 | 09:04 | Clear | <img src="./weather/winter/DT05part01JoesFlat.png" alt="Weather preset DT05part01JoesFlat" loading="lazy"> |
| `DT05part02FreddysBar` | 0.427212 | 10:19 | Clear | <img src="./weather/winter/DT05part02FreddysBar.png" alt="Weather preset DT05part02FreddysBar" loading="lazy"> |
| `DT05part04Distillery` | 0.432218 | 10:27 | Foggy | <img src="./weather/winter/DT05part04Distillery.png" alt="Weather preset DT05part04Distillery" loading="lazy"> |
| `DT05part03HarrysGunshop` | 0.440253 | 10:38 | Clear | <img src="./weather/winter/DT05part03HarrysGunshop.png" alt="Weather preset DT05part03HarrysGunshop" loading="lazy"> |
| `DT03part01JoesFlat` | 0.471424 | 11:23 | Clear | <img src="./weather/winter/DT03part01JoesFlat.png" alt="Weather preset DT03part01JoesFlat" loading="lazy"> |
| `DTFreeRideDayWinter` | 0.518217 | 12:31 | Clear | <img src="./weather/winter/DTFreeRideDayWinter.png" alt="Weather preset DTFreeRideDayWinter" loading="lazy"> |
| `DT05part05ElGreco` | 0.583318 | 14:05 | Foggy | <img src="./weather/winter/DT05part05ElGreco.png" alt="Weather preset DT05part05ElGreco" loading="lazy"> |
| `DT02part01Railwaystation` | 0.588701 | 14:13 | Clear | <img src="./weather/winter/DT02part01Railwaystation.png" alt="Weather preset DT02part01Railwaystation" loading="lazy"> |
| `DT04part01JoesFlat` | 0.625315 | 15:06 | Foggy | <img src="./weather/winter/DT04part01JoesFlat.png" alt="Weather preset DT04part01JoesFlat" loading="lazy"> |
| `DT02part02JoesFlat` | 0.627017 | 15:09 | Clear | <img src="./weather/winter/DT02part02JoesFlat.png" alt="Weather preset DT02part02JoesFlat" loading="lazy"> |
| `DT03part02FreddysBar` | 0.646516 | 15:37 | Foggy | <img src="./weather/winter/DT03part02FreddysBar.png" alt="Weather preset DT03part02FreddysBar" loading="lazy"> |
| `DT02part03Charlie` | 0.656083 | 15:51 | Foggy | <img src="./weather/winter/DT02part03Charlie.png" alt="Weather preset DT02part03Charlie" loading="lazy"> |
| `DT02part04Giuseppe` | 0.687523 | 16:36 | Clear | <img src="./weather/winter/DT02part04Giuseppe.png" alt="Weather preset DT02part04Giuseppe" loading="lazy"> |
| `DT05part06Francesca` | 0.743920 | 17:57 | Clear | <img src="./weather/winter/DT05part06Francesca.png" alt="Weather preset DT05part06Francesca" loading="lazy"> |
| `DT02NewStart1` | 0.768221 | 18:34 | Clear | <img src="./weather/winter/DT02NewStart1.png" alt="Weather preset DT02NewStart1" loading="lazy"> |
| `DT03part03MariaAgnelo` | 0.773717 | 18:41 | Clear | <img src="./weather/winter/DT03part03MariaAgnelo.png" alt="Weather preset DT03part03MariaAgnelo" loading="lazy"> |
| `DT02NewStart2` | 0.776479 | 18:45 | Clear | <img src="./weather/winter/DT02NewStart2.png" alt="Weather preset DT02NewStart2" loading="lazy"> |
| `DT02part05Derek` | 0.781326 | 18:52 | Clear | <img src="./weather/winter/DT02part05Derek.png" alt="Weather preset DT02part05Derek" loading="lazy"> |
| `DT03part04PriceOffice` | 0.815118 | 19:42 | Clear | <img src="./weather/winter/DT03part04PriceOffice.png" alt="Weather preset DT03part04PriceOffice" loading="lazy"> |
| `DT04part02` | 0.928518 | 22:25 | Clear | <img src="./weather/winter/DT04part02.png" alt="Weather preset DT04part02" loading="lazy"> |
| `DT05Distillery_inside` | 0.981817 | 23:42 | Foggy | <img src="./weather/winter/DT05Distillery_inside.png" alt="Weather preset DT05Distillery_inside" loading="lazy"> |
