const { open } = require("node:fs/promises");

let current;

let lowestLocation = Number.MAX_SAFE_INTEGER;

let seeds = [];
let seedToSoil = [];
let soilToFertilizer = [];
let fertilizerToWater = [];
let waterToLight = [];
let lightToTemperature = [];
let temperatureToHumidity = [];
let humidityToLocation = [];

(async () => {
  const file = await open("./input.txt");

  let firstLine = true;
  for await (const line of file.readLines()) {
    if (firstLine) {
      parseSeeds(line);
      firstLine = false;
      continue;
    }

    switch (line) {
      case "seed-to-soil map:":
        current = seedToSoil;
        break;
      case "soil-to-fertilizer map:":
        current = soilToFertilizer;
        break;
      case "fertilizer-to-water map:":
        current = fertilizerToWater;
        break;
      case "water-to-light map:":
        current = waterToLight;
        break;
      case "light-to-temperature map:":
        current = lightToTemperature;
        break;
      case "temperature-to-humidity map:":
        current = temperatureToHumidity;
        break;
      case "humidity-to-location map:":
        current = humidityToLocation;
        break;
      case "":
        break;

      default:
        parseRanges(line);
        break;
    }
  }

  console.log(seedToSoil);
  console.log(soilToFertilizer);
  console.log(fertilizerToWater);
  console.log(waterToLight);
  console.log(lightToTemperature);
  console.log(temperatureToHumidity);
  console.log(humidityToLocation);

  const start = new Date().getTime();
  const mapper = new Mapper();

  seeds.forEach((s) => {
    for (let index = s.start; index < s.end; index++) {
      const currentLocation = mapper
        .start(index)
        .map(seedToSoil)
        .map(soilToFertilizer)
        .map(fertilizerToWater)
        .map(waterToLight)
        .map(lightToTemperature)
        .map(temperatureToHumidity)
        .map(humidityToLocation)
        .finish();

      if (currentLocation < lowestLocation) {
        lowestLocation = currentLocation;
        console.log("new lowest:", lowestLocation);
      }
    }
  });

  const end = new Date().getTime();
  console.log("It took %i seconds to compute", (end - start) / 1000);
  console.log("Lowest location is:", lowestLocation);
})();

function parseSeeds(line) {
  const numbers = line
    .split(" ")
    .slice(1)
    .map((e) => +e);

  let seed;

  numbers.forEach((e, i) => {
    if (i % 2 == 0) {
      seed = { start: e };
    } else {
      seed.end = seed.start + e;
      seeds.push(seed);
      seed = undefined;
    }
  });

  console.log("Seeds:", seeds);
  return seeds;
}

function parseRanges(line) {
  const [destinationStart, sourceStart, rangeLength] = line
    .split(" ")
    .map((e) => +e);
  const sourceEnd = sourceStart + rangeLength;
  const destinationEnd = destinationStart + rangeLength;

  current.push({
    destinationStart,
    destinationEnd,
    sourceStart,
    sourceEnd,
  });
}

function findMatch(value, map) {
  const found = map.find((e) => value >= e.sourceStart && value < e.sourceEnd);

  if (found) {
    return value - found.sourceStart + found.destinationStart;
  }

  return value;
}

function Mapper() {
  let cache;

  this.start = function (value) {
    cache = value;
    return this;
  };

  this.map = function (map) {
    cache = findMatch(cache, map);
    return this;
  };

  this.finish = function () {
    return cache;
  };
}
