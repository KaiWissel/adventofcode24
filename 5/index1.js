const { open } = require("node:fs/promises");

let current;
let last;

let seeds;
let seedToSoil;
let soilToFertilizer;
let fertilizerToWater;
let waterToLight;
let lightToTemperature;
let temperatureToHumidity;
let humidityToLocation;

(async () => {
  const file = await open("./input.txt");

  let firstLine = true;
  let firstBreak = true;
  for await (const line of file.readLines()) {
    if (firstLine) {
      seeds = parseSeeds(line);
      prepareArrays();
      firstLine = false;
      last = seeds;
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
        if (firstBreak) {
          firstBreak = false;
          continue;
        }

        fillGaps();
        last = current;
        break;

      default:
        parseRanges(line);
        break;
    }
  }

  console.log(Math.min(...current));
})();

function parseSeeds(line) {
  const seeds = line
    .split(" ")
    .slice(1)
    .map((e) => +e);
  console.log("Seeds:", seeds);

  return seeds;
}

function prepareArrays() {
  seedToSoil = Array(seeds.length);
  soilToFertilizer = Array(seeds.length);
  fertilizerToWater = Array(seeds.length);
  waterToLight = Array(seeds.length);
  lightToTemperature = Array(seeds.length);
  temperatureToHumidity = Array(seeds.length);
  humidityToLocation = Array(seeds.length);
}

function parseRanges(line) {
  if (!current) return;

  const [destinationStart, sourceStart, rangeLength] = line
    .split(" ")
    .map((e) => +e);
  const sourceEnd = sourceStart + rangeLength;

  last.forEach((e, index) => {
    if (e >= sourceStart && e < sourceEnd) {
      console.log("in range", e, index);
      current[index] = e - sourceStart + destinationStart;
    }
  });
  console.log(current);
}

function fillGaps() {
  for (let index = 0; index < current.length; index++) {
    if (!current[index]) {
      current[index] = last[index];
    }
  }

  console.log(current);
}
