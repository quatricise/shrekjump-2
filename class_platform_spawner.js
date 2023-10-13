class PlatformSpawner {
  constructor() {
    this.heightOffset = { //min and max distance between the last platform and the one to be spawned
      min: 140,
      max: 270
    }
    this.heightOffset_default = {
      ...this.heightOffset
    }
    this.nextSpawn = {
      heightOffset: randR(this.heightOffset.min, this.heightOffset.max),
      hasSpike: false,
      two_platforms: false,
      two_boulders: false,
      super_cloudy: false,
    }
    this.chance_mod = {
      spike: 0,
      two_platforms: 0,
      two_boulders: 0,
    }
    this.previous_height_offset = 0;
    this.boom_boom = {
      active: false,
      platforms_total: 0, //calculated upon activation
      platforms_left: 0, //calculated upon activation
    }
    this.crumbly_crumble = {
      active: false,
      platforms_total: 0, //calculated upon activation
      platforms_left: 0, //calculated upon activation
    }
    gameObjects.push(this)
  }
  update() { 
    this.checkForSpawn()
    this.recalcDifficulty()    
  }
  checkForSpawn() {
    if(platforms[platforms.length - 1].pos.y - globals.platformSpawnHeight < this.nextSpawn.heightOffset)
    return

    this.spawn()
  }
  recalcDifficulty() {
    let difficulty = globals.difficulty
    chance.spike = chance_default.spike + round(difficulty/10)
    chance.soldier = Math.min(chance_default.soldier + round(difficulty/8), chance_max.soldier)
    chance.collectible = Math.min(chance_default.collectible + round(difficulty/20), chance_max.collectible)
    chance.two_platforms = Math.min(chance_default.two_platforms + round(difficulty/10), chance_max.two_platforms)
    chance.super_cloudy = Math.min(chance_default.super_cloudy + round(difficulty/20), chance_max.super_cloudy)
    chance.boulder = Math.min(chance_default.boulder + round(difficulty/12), chance_max.boulder)
    chance.two_boulders = Math.min(chance_default.two_boulders + round(difficulty/15), chance_max.two_boulders)
    chance.boom_boom = Math.min(chance_default.boom_boom + round(difficulty/18), chance_max.boom_boom)
    chance.crumbly_crumble = Math.min(chance_default.crumbly_crumble + round(difficulty/16), chance_max.crumbly_crumble)

    platform_weights.timed = platform_weights_default.timed + round(difficulty/7)
    platform_weights.icy = platform_weights_default.icy + round(difficulty/10)
    platform_weights.explosive = platform_weights_default.explosive + round(difficulty/10)
    platform_weights.skip_platform = Math.min(platform_weights_default.skip_platform + round(difficulty/12), platform_weights_max.skip_platform)

    this.heightOffset.max = this.heightOffset_default.max + round(difficulty/1.5)
    this.heightOffset.min = this.heightOffset_default.min + round(difficulty/2)
  }
  spawn() {
    let platform;
    let type = "random";

    if(randChance(chance.boom_boom) && !this.boom_boom.active && !this.crumbly_crumble.active) this.activateBoomBoom()
    else
    if(randChance(chance.crumbly_crumble) && !this.boom_boom.active && !this.crumbly_crumble.active) this.activateCrumblyCrumble()


    if(this.boom_boom.platforms_left <= 0) {
      this.boom_boom.active = false
    }
    if(this.boom_boom.active) {
      type = "explosive"
      this.boom_boom.platforms_left--
    }

    if(this.crumbly_crumble.platforms_left <= 0) {
      this.crumbly_crumble.active = false
    }
    if(this.crumbly_crumble.active) {
      type = "timed"
      this.crumbly_crumble.platforms_left--
    }

    if(this.nextSpawn.two_platforms) {
      //if two platforms should be spawned
      let pos1, pos2;
      let positions_different = false
      while(!positions_different) {
        pos1 = {
          x: rand(
            cw/2 + rand(0, globals.maxPlatformSpread), 
            cw/2 - rand(0, globals.maxPlatformSpread)
            ),
            y: globals.platformSpawnHeight + randR(-20, 20),
        }
        pos2 = {
          x: rand(
            cw/2 + rand(0, globals.maxPlatformSpread), 
            cw/2 - rand(0, globals.maxPlatformSpread)
            ),
            y: globals.platformSpawnHeight + randR(-20, 20),
          }
        if(pos2.x > pos1.x + 160 || pos2.x < pos1.x - 160) {
          positions_different = true
        }
      }
      platform = spawnPlatform(this.nextSpawn.hasSpike, pos1, type)
      if(randChance(80)) platform = spawnPlatform(!this.nextSpawn.hasSpike, pos2, type)
      else platform = spawnPlatform(true, pos2, type)


        
      if(randR(0,100) <= chance.boulder) {
        let pos = {
          x: randR(data.boulder.hitbox.x/2, cw - data.boulder.hitbox.x/2),
          y: randR(-100, -200),
        }
        new Boulder(pos)
        if(this.nextSpawn.two_boulders) {
          let newPos = {
            x: pos.x,
            y: pos.y + pickRand([-60,-50,-40,-30,30,40,50,60])
          }
          if(newPos.x >= cw/2) newPos.x -= cw/2 - data.boulder.hitbox.x/2
          else
          if(newPos.x < cw/2) newPos.x += cw/2 - data.boulder.hitbox.x/2
          new Boulder(newPos)
          this.chance_mod.two_boulders = 0
        }
      }

    }
    else {
      //if one platform should be spawned
      platform = spawnPlatform(this.nextSpawn.hasSpike, undefined, type )
    }
    if(this.nextSpawn.super_cloudy) {
      let count = randR(events.super_cloudy.clouds_min, events.super_cloudy.clouds_max)
      for (let i = 0; i < count; i++) {
        new Cloud(
          {
            x: rand(data.cloud.hitbox.x/2, cw - data.cloud.hitbox.x/2),
            y: rand(globals.platformSpawnHeight - events.super_cloudy.height_spread, globals.platformSpawnHeight),
          }
        )
      }
      let umbrella_type;
      if(randR(0,100) <= chance.umbrella_super) umbrella_type = "super"
      else umbrella_type = "default"
      new Umbrella(
        {
          x: rand(data.umbrella.hitbox.x/2, cw - data.umbrella.hitbox.x/2),
          y: globals.platformSpawnHeight + events.super_cloudy.height_spread/2,
        },
        umbrella_type
      )
    }
    
    globals.difficulty++
    this.prepareNext()
    if(platform === "skip_platform") this.nextSpawn.heightOffset += randR(this.heightOffset.min * 0.6, this.heightOffset.max * 0.6)
  }
  prepareNext() {
    this.previous_height_offset = this.nextSpawn.heightOffset
    if(
      this.previous_height_offset 
      > 
      this.heightOffset.min + ((this.heightOffset.max - this.heightOffset.min)/2 )
    ) {
      this.nextSpawn.heightOffset = randR(this.heightOffset.min, this.heightOffset.max)
      console.log("limited max height offset by: " + ((this.heightOffset.max - this.heightOffset.min)/2))
    }
    else {
      this.nextSpawn.heightOffset = randR(this.heightOffset.min, this.heightOffset.max - ((this.heightOffset.max - this.heightOffset.min)/2) )
    }
    console.log("next spawn height offset: " + this.nextSpawn.heightOffset)
    this.nextSpawn.hasSpike = false
    this.nextSpawn.two_platforms = false
    this.nextSpawn.super_cloudy = false
    this.nextSpawn.two_boulders = false

    //spike chance
    if(randR(0, 100) <= chance.spike + this.chance_mod.spike) {
      this.nextSpawn.hasSpike = true
      this.chance_mod.spike = 0
    }
    else this.chance_mod.spike += 12
    
    //two platforms chance
    if(randR(0, 100) <= chance.two_platforms + this.chance_mod.two_platforms) {
      this.nextSpawn.two_platforms = true
      this.chance_mod.two_platforms = 0
    }
    else this.chance_mod.two_platforms += 3

    //two platforms chance
    if(randR(0, 100) <= chance.two_boulders + this.chance_mod.two_boulders) {
      this.nextSpawn.two_boulders = true
    }
    else this.chance_mod.two_boulders += 1

    if(randR(0,100) <= chance.super_cloudy) {
      this.nextSpawn.super_cloudy = true
      console.log('gonna be super cloudy')
    }
  }
  activateBoomBoom() {
    this.boom_boom.platforms_total = randR(events.boom_boom.explosive_platforms_min, events.boom_boom.explosive_platforms_max)
    this.boom_boom.platforms_left = this.boom_boom.platforms_total
    this.boom_boom.active = true
    console.log("it's gonna boom boom baby!")
  }
  activateCrumblyCrumble() {
    this.crumbly_crumble.platforms_total = randR(events.crumbly_crumble.timed_platforms_min, events.crumbly_crumble.timed_platforms_max)
    this.crumbly_crumble.platforms_left = this.crumbly_crumble.platforms_total
    this.crumbly_crumble.active = true
    console.log("it's gonna crumble")
  }
}

//todo improve platform generation - enable dual-platforms
// new platform -> cloud platforms, they move up and down a bit with the wind variable
// make shrek fart whennever he jumps after consuming the onion


function spawnPlatform(hasSpike, pos, type = "random") {
  let platform
  let platform_pick
  if(type === "random") {
    platform_pick = weightedRandom(platform_weights)
  }
  else {
    platform_pick = type
  }
  let platform_pos = {
    //basically - put the platform somewhere around the horizontal center of the canvas
    x: rand(
    cw/2 + rand(0, globals.maxPlatformSpread), 
    cw/2 - rand(0, globals.maxPlatformSpread)
    ),
    y: globals.platformSpawnHeight,
  }
  if(pos) platform_pos = pos
  if(platform_pick === "basic") {
    platform = new PlatformBasic(platform_pos, hasSpike)
  }
  if(platform_pick === "timed") {
    platform = new PlatformTimed(platform_pos, hasSpike)
  }
  if(platform_pick === "icy") {
    platform = new PlatformIcy(platform_pos, hasSpike)
  }
  if(platform_pick === "explosive") {
    platform = new PlatformExplosive(platform_pos, hasSpike)
  }
  if(platform_pick === "skip_platform") {
    if(previous_platform === "skip_platform") {
      spawnPlatform(hasSpike)
      return
    }
    console.log('skipped platform')
    previous_platform = platform_pick
    return platform_pick
  }
  previous_platform = platform_pick

  let soldierChance = randR(0,100)

  if(soldierChance <= chance.soldier) {
    let soldier = weightedRandom(soldier_weights)
    if(soldier === "javelineer") new Javelineer(platform)
    if(soldier === "boulderman") /* new Boulderman() */ console.log('boulderman not finished')
  }

  if(
    player.life < player.lifeMax 
    && 
    randR(0,100) < 4 * (player.lifeMax - player.life)
    &&
    globals.score < globals.goldenHeartLevels[globals.goldenHeartsSpawned]
  ) {
    new Heart(
      "regular",
      {
        x: rand(data.heart.hitbox.x/2, cw - data.heart.hitbox.x/2),
        y: randR(-100, -200),
      }
    )
  }
  else
  if(randR(0,100) < chance.collectible) {
    spawnCollectible()
  }
}

function spawnCollectible() {
  let collectibleName = weightedRandom(collectible_weights)
  let height = randR(-100, -200)

  if(
    globals.score > globals.goldenHeartLevels[globals.goldenHeartsSpawned] && 
    globals.goldenHeartsSpawned <= globals.goldenHeartLevels.length - 1
  ) {
    new Heart(
      "golden",
      {
        x: rand(data.heart.hitbox.x/2, cw - data.heart.hitbox.x/2),
        y: height,
      }
    )
    return
  }

  if(collectibleName === "umbrella") {
    let type;
    if(randR(0,100) <= chance.umbrella_super) type = "super"
    else type = "default"
    new Umbrella(
      {
        x: rand(data.umbrella.hitbox.x/2, cw - data.umbrella.hitbox.x/2),
        y: height,
      },
      type
    )
  }

  if(collectibleName === "heart") {
    if(player.life === player.lifeMax) {
      spawnCollectible()
      return
    }
    new Heart(
      "regular",
      {
        x: rand(data.heart.hitbox.x/2, cw - data.heart.hitbox.x/2),
        y: height,
      }
    )
  }

  if(collectibleName === "onion") {
    new Onion(
      {
        x: rand(data.onion.hitbox.x/2, cw - data.onion.hitbox.x/2),
        y: height,
      }
    )
  }
  if(collectibleName === "cloud") {
    new Cloud(
      {
        x: rand(data.cloud.hitbox.x/2, cw - data.cloud.hitbox.x/2),
        y: height,
      }
    )
  }
  if(
    collectibleName === "heart_golden" &&
    globals.goldenHeartsSpawned <= globals.goldenHeartLevels.length - 1
  ) {
    new Heart(
      "golden",
      {
        x: rand(data.heart.hitbox.x/2, cw - data.heart.hitbox.x/2),
        y: height,
      }
    )
  }
}
