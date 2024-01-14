const { open } = require("node:fs/promises");

let times;
let distances;
let races;

(async () => {
  const file = await open("./input.txt");

  for await (const line of file.readLines()) {
    if (!times) {
      times = parseLine(line);
      continue;
    }
    distances = parseLine(line);
  }

  races = times.map((time, index) => {
    return { time, distance: distances[index] };
  });

  const numberOfWins = races.map(calcRace);
  console.log("numberOfWins", numberOfWins);
  const result = numberOfWins.reduce((acc, cur) => acc * cur, 1);
  console.log("result", result);
})();

function parseLine(line) {
  return line
    .split(" ")
    .slice(1)
    .filter((e) => !!e);
}

function calcRace(race) {
  const completeTime = race.time;
  const recordDistance = race.distance;

  const speedPerTime = 1;

  let beatCounter = 0;

  for (
    let chargeTime = 1;
    chargeTime < completeTime;
    // chargeTime < Math.ceil(completeTime / 2);
    chargeTime++
  ) {
    const runTime = completeTime - chargeTime;
    const ownDistance = runTime * speedPerTime * chargeTime;

    // console.log("charge", chargeTime);
    // console.log("runTime", runTime);
    // console.log("ownDistance", ownDistance);

    if (ownDistance > recordDistance) {
      console.log(
        "Charging for %i beats record of %i",
        chargeTime,
        recordDistance
      );
      beatCounter++;
    }
  }

  return beatCounter;
  // return beatCounter *2;
}
