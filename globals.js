let globals = {
  scrollspeed: 105,
  scrollSpeedMod: 1,
  fallSpeed: 245,
  fallSpeedMod: 1.9,
  fallSmoothing: 0.6,
  speedSmoothing: 0.2,
  umbrellaFallSmoothing: 0.2,
  umbrellaJumpRedux: 0.5,
  /** This number doesn't represent any tangible property, just trial-and-error */
  explosionFalloff: 2, 
  explosionXFalloff: 0.99,
  /** range on x axis, signifies the max offset from center */
  maxPlatformSpread: 200,
  /** number of pixels that are used to determine whether shrek has landed on a platform */
  landingBufferHeight: 7, 
  scoreBonusMinHeight: 200,
  score: 0,
  platformsPassed: 0,
  platformSpawnHeight: -200,
  goldenHeartLevels: [
    75, 150, 225, 300, 400
  ],
  goldenHeartsSpawned: 0,
  spikeFallMinJumps: 3,
  paused: false,
  started: false,
  gameover: false,
  /** determines whether icy platforms can spawn */
  iceLevel: false, 
  restartWarning: false,
  quitWarning: false,
  randomExplosions: true,
  showPositionIndicator: true,
  /** used to alter chances and distribution */
  difficulty: 0, 
  advertsVisible: true,
}

let globals_default = _.cloneDeep(globals)

let shitPlatformSpawning;

let currentStage;


let super_cloudy = {
  clouds_min: 4,
  clouds_max: 7,
  height_spread: 300,
}

let skip_two_platforms = {
  chance: 1, // %
  boulder: {
    min: 1,
    max: 4
  },
  umbrellas: 1,
  skipped_last: false,
} 
let chasm = {
  /** % */
  chance: 1, 
  skip_platforms: {
    min: 3,
    max: 6
  },
  boulder: {
    min: 1,
    max: 4
  },
  umbrellas: 2,
} 

let events = {
  boom_boom: {
    explosive_platforms_min: 6,
    explosive_platforms_max: 9,
  },
  crumbly_crumble: {
    timed_platforms_min: 7,
    timed_platforms_max: 11,
  },
  super_cloudy: {
    clouds_min: 4,
    clouds_max: 7,
    height_spread: 300,
  }
}

const rebind = {
  /** Object.keys(binds)[0] - One of the keys from binds */
  bind: null, 
  active: false,
  visual_label: null,
}

/** gets updated over the course of the run */
let chance = { 
  spike: 10,
  soldier: 18,
  collectible: 15,
  two_platforms: 5,
  umbrella_super: 22,
  boulder: 0,
  two_boulders: 0,
  super_cloudy: 2, //a platform spawns a bunch of clouds everywhere
  boom_boom: 0, //0
  crumbly_crumble: 1,
}

/** static */
let chance_max = {
  spike: 80,
  soldier: 30,
  collectible: 30, 
  two_platforms: 50,
  super_cloudy: 50, //15
  umbrella_super: 50,
  boulder: 15, //15
  two_boulders: 25,
  boom_boom: 4, //3
  crumbly_crumble: 6,
}
Object.freeze(chance_max)

let chance_default = _.cloneDeep(chance)

//default weights, are updated during the run
let platform_weights = {
  basic: 69,
  timed: 16,
  icy: 7,
  explosive: 4, //3
  skip_platform: 5, //5
}
let platform_weights_max = {
  skip_platform: 16, //5
}
Object.freeze(platform_weights_max)

let previous_platform = null

let platform_weights_default = _.cloneDeep(platform_weights)

let collectible_weights = { // should total to 100, that way it works as percentages
  umbrella: 22,
  heart: 28,
  heart_golden: 2, //2
  onion: 5,
  cloud: 38,
}

let soldier_weights = {
  javelineer: 60,
  boulderman: 40
}

let colors = {
  hitboxColor: "#222222",
  stamina_high: "hsl(90, 80%, 50%)",
  stamina_medium: "yellow",
  stamina_low: "red",
  stamina_outline: "black",
  collectibles: "red",
  text: "black",
  onion_outline: "black",
  onion: "hsl(45, 40%, 65%)",
  score: "hsl(98, 75%, 45%)",
}

let debug = {
  drawHitboxes: false,
  hideSprites: false,
  consoleMessages: false,
}

let fonts = {
  score: null,
}