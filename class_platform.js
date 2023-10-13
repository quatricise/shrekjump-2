class PlatformBasic {
  constructor(pos, hasSpike = false) {
    this.pos = pos
    this.hitbox = data.platforms.basic.hitbox
    this.sprite = {
      img: new Image(),
      src: data.platforms.basic.sprite.default,
      dim: data.platforms.basic.spriteDimensions,
      offset: data.platforms.basic.spriteOffset,
    }
    this.spike = {
      pos: JSON.parse(JSON.stringify(this.pos)),
      detached: false,
      exists: hasSpike,
      hitbox: data.spike.hitbox,
      sprite: {
        img: new Image(),
        src: data.spike.sprite.default,
        dim: data.spike.spriteDimensions,
        offset: data.spike.spriteOffset,
      },
      offset: data.spike.offset,
    }
    this.offset = data.platforms.basic.offset
    this.sprite.img.src = this.sprite.src
    this.spike.sprite.img.src = this.spike.sprite.src
    this.soldier = null
    this.playerLandedCount = 0
    gameObjects.push(this)
    platforms.push(this)
  }
  detachSpike() {
    this.spike.detached = true
    globals.score++
    new Overlay("score_plus", undefined, this.spike)
  }
  update() {
    if(this.playerLandedCount >= globals.spikeFallMinJumps && !this.spike.detached && this.spike.exists) this.detachSpike()
    this.pos.y += globals.scrollspeed * dt * globals.scrollSpeedMod
    
    if((this.pos.y - this.hitbox.y/2) > ch) {
      this.pass()
    }
    this.updateSpikePos()
  }
  updateSpikePos() {
    if(this.spike.detached) this.spike.pos.y += globals.scrollspeed * 2 * dt
    else {this.spike.pos.x = this.pos.x ;this.spike.pos.y = this.pos.y}
  }
  draw() {
    if(this.spike.exists) {
      ctx.drawImage(this.spike.sprite.img, this.spike.pos.x - this.spike.sprite.dim.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.sprite.dim.y/2 + this.spike.offset.y, this.spike.sprite.dim.x, this.spike.sprite.dim.y)
      if(debug.drawHitboxes) {
        ctx.strokeRect(this.spike.pos.x - this.spike.hitbox.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.hitbox.y/2 + this.spike.offset.y, this.spike.hitbox.x, this.spike.hitbox.y)
      }
    }
    if(!debug.hideSprites) {
      ctx.drawImage(this.sprite.img, this.pos.x - this.sprite.dim.x/2 + this.sprite.offset.x, this.pos.y - this.sprite.dim.y/2 + this.sprite.offset.y, this.sprite.dim.x, this.sprite.dim.y)
    }
    if(debug.drawHitboxes) {
      ctx.strokeStyle = globals.hitboxColor
      ctx.lineWidth = 1
      ctx.strokeRect(this.pos.x - this.hitbox.x/2, this.pos.y - this.hitbox.y/2, this.hitbox.x, this.hitbox.y)
    }
  }
  pass() {
    globals.scrollspeed += 0.8
    this.destroy()
  }
  destroy() {
    if(player.pos.y < globals.scoreBonusMinHeight) {
      globals.score++
      new Overlay("score_plus", {x: this.pos.x, y: this.pos.y}, player)
    }
    if(this.soldier) this.soldier.die()
    platforms = platforms.filter(plat => plat != this)
    gameObjects = gameObjects.filter(obj => obj != this)
    
    
    globals.platformsPassed++
    globals.score++
  }
}

class PlatformTimed {
  constructor(pos, hasSpike = false) {
    this.pos = pos
    this.hitbox = data.platforms.timed.hitbox
    this.sprite = {
      img: new Image(),
      src: data.platforms.timed.sprite.default,
      dim: data.platforms.timed.spriteDimensions,
      offset: data.platforms.timed.spriteOffset,
    }
    this.spike = {
      pos: JSON.parse(JSON.stringify(this.pos)),
      detached: false,
      exists: hasSpike,
      hitbox: data.spike.hitbox,
      sprite: {
        img: new Image(),
        src: data.spike.sprite.default,
        dim: data.spike.spriteDimensions,
        offset: data.spike.spriteOffset,
      },
      offset: data.spike.offset,
    }
    this.offset = data.platforms.timed.offset
    this.sprite.img.src = this.sprite.src
    this.spike.sprite.img.src = this.spike.sprite.src
    this.lifeMax = data.platforms.timed.standTime
    this.life = this.lifeMax
    this.activated = false
    this.soldier = null
    this.playerLandedCount = 0
    gameObjects.push(this)
    platforms.push(this)
  }
  detachSpike() {
    this.spike.detached = true
    globals.score++
    new Overlay("score_plus", undefined, this.spike)
  }
  update() {
    if(this.playerLandedCount >= globals.spikeFallMinJumps && !this.spike.detached && this.spike.exists) this.detachSpike()
    this.updateSpikePos()

    this.pos.y += globals.scrollspeed * dt * globals.scrollSpeedMod
    if(this.activated) {
      this.life -= 1000 * dt
    }
    if(this.life <= 0 ) this.destroy()
    if((this.pos.y - this.hitbox.y/2) > ch) {
      this.pass()
    }
  }
  updateSpikePos() {
    
    if(this.spike.detached) this.spike.pos.y += globals.scrollspeed * 2 * dt
    else {this.spike.pos.x = this.pos.x ;this.spike.pos.y = this.pos.y}
    
  }
  draw() {
    if(this.spike.exists) {
      ctx.drawImage(this.spike.sprite.img, this.spike.pos.x - this.spike.sprite.dim.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.sprite.dim.y/2 + this.spike.offset.y, this.spike.sprite.dim.x, this.spike.sprite.dim.y)
      if(debug.drawHitboxes) {
        ctx.strokeRect(this.spike.pos.x - this.spike.hitbox.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.hitbox.y/2 + this.spike.offset.y, this.spike.hitbox.x, this.spike.hitbox.y)
      }
    }
    if(!debug.hideSprites) {
      ctx.save()
      ctx.globalAlpha = Math.min(1, Math.max(this.life / this.lifeMax, 0))
      ctx.drawImage(this.sprite.img, this.pos.x - this.sprite.dim.x/2 + this.sprite.offset.x, this.pos.y - this.sprite.dim.y/2 + this.sprite.offset.y, this.sprite.dim.x, this.sprite.dim.y)
      ctx.restore()
    }
    if(debug.drawHitboxes) {
      ctx.strokeStyle = globals.hitboxColor
      ctx.lineWidth = 1
      ctx.strokeRect(this.pos.x - this.hitbox.x/2, this.pos.y - this.hitbox.y/2, this.hitbox.x, this.hitbox.y)
    }

  }
  pass() {
    globals.scrollspeed += 0.8
    this.destroy()
  }
  destroy() {
    if(player.pos.y < globals.scoreBonusMinHeight) {
      globals.score++
      new Overlay("score_plus", undefined, player)
    }
    if(this.soldier) this.soldier.die()
    platforms = platforms.filter(plat => plat != this)
    gameObjects = gameObjects.filter(obj => obj != this)
    
    
    globals.platformsPassed++
    globals.score++
    new Overlay("score_plus", undefined, this)

  }
}
class PlatformIcy {
  constructor(pos, hasSpike = false) {
    this.pos = pos
    this.hitbox = data.platforms.icy.hitbox
    this.sprite = {
      img: new Image(),
      src: data.platforms.icy.sprite.default,
      dim: data.platforms.icy.spriteDimensions,
      offset: data.platforms.icy.spriteOffset,
    }
    this.spike = {
      pos: JSON.parse(JSON.stringify(this.pos)),
      detached: false,
      exists: hasSpike,
      hitbox: data.spike.hitbox,
      sprite: {
        img: new Image(),
        src: data.spike.sprite.default,
        dim: data.spike.spriteDimensions,
        offset: data.spike.spriteOffset,
      },
      offset: data.spike.offset,
    }
    this.state = "default"
    this.timers = {
      broken: data.platforms.icy.timeToFade
    }
    this.offset = data.platforms.icy.offset
    this.sprite.img.src = this.sprite.src
    this.spike.sprite.img.src = this.spike.sprite.src
    this.soldier = null
    this.playerLandedCount = 0
    gameObjects.push(this)
    platforms.push(this)
  }
  detachSpike() {
    this.spike.detached = true
    globals.score++
    new Overlay("score_plus", undefined, this.spike)
    console.log("detached spike")
  }
  update() {
    if(this.playerLandedCount >= globals.spikeFallMinJumps && !this.spike.detached && this.spike.exists) this.detachSpike()
    this.updateSpikePos()

    this.pos.y += globals.scrollspeed * dt * globals.scrollSpeedMod
    if((this.pos.y - this.hitbox.y/2) > ch) {
      this.pass()
    }
    this.updateTimers()
    this.updateSprite()
  }
  updateSpikePos() {
    if(this.spike.detached) this.spike.pos.y += globals.scrollspeed * dt * globals.scrollSpeedMod * 2 
    else {this.spike.pos.x = this.pos.x ;this.spike.pos.y = this.pos.y}
    
  }
  crack() {
    if(this.state === "default") {
      this.state = "cracked"
      return
    }
    if(this.state === "cracked") {
      this.state = "broken"
      this.timers.broken = data.platforms.icy.timeToFade
      return
    }
  }
  updateSprite() {
    if(this.state === "default") this.sprite.img.src = images.platform_icy.default
    if(this.state === "cracked") this.sprite.img.src = images.platform_icy.cracked
    if(this.state === "broken") this.sprite.img.src = images.platform_icy.broken
  }
  updateTimers() {
    if(this.state === "broken" ) this.timers.broken -= 1000 * dt
    if(this.timers.broken <= 0) this.destroy()
  }
  draw() {
    if(this.spike.exists) {
      ctx.drawImage(this.spike.sprite.img, this.spike.pos.x - this.spike.sprite.dim.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.sprite.dim.y/2 + this.spike.offset.y, this.spike.sprite.dim.x, this.spike.sprite.dim.y)
      if(debug.drawHitboxes) {
        ctx.strokeRect(this.spike.pos.x - this.spike.hitbox.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.hitbox.y/2 + this.spike.offset.y, this.spike.hitbox.x, this.spike.hitbox.y)
      }
    }
    if(!debug.hideSprites) {
      if(this.state === "broken") {
        ctx.save()
        ctx.globalAlpha = Math.max(0, this.timers.broken/data.platforms.icy.timeToFade)
      }
      ctx.drawImage(this.sprite.img, this.pos.x - this.sprite.dim.x/2 + this.sprite.offset.x, this.pos.y - this.sprite.dim.y/2 + this.sprite.offset.y, this.sprite.dim.x, this.sprite.dim.y)
      if(this.state === "broken") ctx.restore()
    }
    if(debug.drawHitboxes) {
      ctx.strokeStyle = globals.hitboxColor
      ctx.lineWidth = 1
      ctx.strokeRect(this.pos.x - this.hitbox.x/2, this.pos.y - this.hitbox.y/2, this.hitbox.x, this.hitbox.y)
    }

  }
  pass() {
    globals.scrollspeed += 0.8
    this.destroy()
  }
  destroy() {
    if(player.pos.y < globals.scoreBonusMinHeight) {
      globals.score++
      new Overlay("score_plus", undefined, player)
    }
    if(this.soldier) this.soldier.die()
    platforms = platforms.filter(plat => plat != this)
    gameObjects = gameObjects.filter(obj => obj != this)
    
    
    globals.platformsPassed++
    globals.score++
    new Overlay("score_plus", undefined, this)
  }
}
class PlatformExplosive {
  constructor(pos, hasSpike = false) {
    this.pos = pos
    this.hitbox = data.platforms.explosive.hitbox
    this.sprite = {
      img: new Image(),
      src: data.platforms.explosive.sprite.default,
      dim: data.platforms.explosive.spriteDimensions,
      offset: data.platforms.explosive.spriteOffset,
    }
    this.spike = {
      pos: JSON.parse(JSON.stringify(this.pos)),
      detached: false,
      exists: hasSpike,
      hitbox: data.spike.hitbox,
      sprite: {
        img: new Image(),
        src: data.spike.sprite.default,
        dim: data.spike.spriteDimensions,
        offset: data.spike.spriteOffset,
      },
      offset: data.spike.offset,
    }
    this.activated = false
    this.offset = data.platforms.explosive.offset
    this.explosionStrength = data.platforms.explosive.explosionStrength
    this.sprite.img.src = this.sprite.src
    this.spike.sprite.img.src = this.spike.sprite.src
    this.soldier = null
    this.playerLandedCount = 0
    gameObjects.push(this)
    platforms.push(this)
  }
  detachSpike() {
    this.spike.detached = true
    globals.score++
    new Overlay("score_plus", undefined, this.spike)
  }
  update() {
    if(this.playerLandedCount >= globals.spikeFallMinJumps && !this.spike.detached && this.spike.exists) this.detachSpike()
    this.updateSpikePos()

    this.pos.y += globals.scrollspeed * dt * globals.scrollSpeedMod
    if((this.pos.y - this.hitbox.y/2) > ch) {
      this.pass()
    }
  }
  updateSpikePos() {
    
    if(this.spike.detached) this.spike.pos.y += globals.scrollspeed * 2 * dt
    else {this.spike.pos.x = this.pos.x ;this.spike.pos.y = this.pos.y}
    
  }
  explode() {
    let vel = {
      x: player.vel.x,
      y: this.explosionStrength * -1
    }
    console.log("vel x: " + vel.x + "y: " + vel.y)
    player.exploded = true
    player.jumping = false
    player.falling = true
    player.standing = false
    player.mods.umbrella = false
    player.mods.umbrella_super = false
    player.timers.immobilize = data.platforms.explosive.immobilizeFor

    if(globals.randomExplosions) {
      vel = vectorRotate(vel.x, vel.y, randR(-data.platforms.explosive.angleVariance, data.platforms.explosive.angleVariance) * PI / 180)
      player.vel = vel
    }
    else {
      player.vel.y = vel.y
    }
    new Explosion(this.pos)
    this.destroy()
  }
  draw() {
    if(this.spike.exists) {
      ctx.drawImage(this.spike.sprite.img, this.spike.pos.x - this.spike.sprite.dim.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.sprite.dim.y/2 + this.spike.offset.y, this.spike.sprite.dim.x, this.spike.sprite.dim.y)
      if(debug.drawHitboxes) {
        ctx.strokeRect(this.spike.pos.x - this.spike.hitbox.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.hitbox.y/2 + this.spike.offset.y, this.spike.hitbox.x, this.spike.hitbox.y)
      }
    }
    if(!debug.hideSprites) {
      ctx.drawImage(this.sprite.img, this.pos.x - this.sprite.dim.x/2 + this.sprite.offset.x, this.pos.y - this.sprite.dim.y/2 + this.sprite.offset.y, this.sprite.dim.x, this.sprite.dim.y)
    }
    if(debug.drawHitboxes) {
      ctx.strokeStyle = globals.hitboxColor
      ctx.lineWidth = 1
      ctx.strokeRect(this.pos.x - this.hitbox.x/2, this.pos.y - this.hitbox.y/2, this.hitbox.x, this.hitbox.y)
    }

  }
  pass() {
    globals.scrollspeed += 0.8
    this.destroy()
  }
  destroy() {
    if(player.pos.y < globals.scoreBonusMinHeight) {
      globals.score++
      new Overlay("score_plus", {x: this.pos.x, y: this.pos.y}, player)
    }
    if(this.soldier) this.soldier.die()
    platforms = platforms.filter(plat => plat != this)
    gameObjects = gameObjects.filter(obj => obj != this)
    
    
    globals.platformsPassed++
    globals.score++
    new Overlay("score_plus", undefined, this)
  }
}


//todo the base platform class - i need to finish this so i can stop writing the same code 4 times
class Platform {
  constructor(pos, hasSpike = false) {
    this.pos = pos
    this.hitbox = data.platforms.basic.hitbox
    this.sprite = {
      img: new Image(),
      src: data.platforms.basic.sprite.default,
      dim: data.platforms.basic.spriteDimensions,
      offset: data.platforms.basic.spriteOffset,
    }
    this.spike = {
      pos: JSON.parse(JSON.stringify(this.pos)),
      detached: false,
      exists: hasSpike,
      hitbox: data.spike.hitbox,
      sprite: {
        img: new Image(),
        src: data.spike.sprite.default,
        dim: data.spike.spriteDimensions,
        offset: data.spike.spriteOffset,
      },
      offset: data.spike.offset,
    }
    this.offset = data.platforms.basic.offset
    this.sprite.img.src = this.sprite.src
    this.spike.sprite.img.src = this.spike.sprite.src
    this.soldier = null
    this.playerLandedCount = 0
    gameObjects.push(this)
    platforms.push(this)
  }
  detachSpike() {
    this.spike.detached = true
    globals.score++
    new Overlay("score_plus", undefined, this.spike)
  }
  update() {
    if(this.playerLandedCount >= globals.spikeFallMinJumps && !this.spike.detached && this.spike.exists) this.detachSpike()
    this.updateSpikePos()

    this.pos.y += globals.scrollspeed * dt * globals.scrollSpeedMod
    if((this.pos.y - this.hitbox.y/2) > ch) this.pass()
  }
  updateSpikePos() {
    
    if(this.spike.detached) this.spike.pos.y += globals.scrollspeed * 2 * dt
    else {this.spike.pos.x = this.pos.x ;this.spike.pos.y = this.pos.y}
    
  }
  draw() {
    if(this.spike.exists) {
      ctx.drawImage(this.spike.sprite.img, this.spike.pos.x - this.spike.sprite.dim.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.sprite.dim.y/2 + this.spike.offset.y, this.spike.sprite.dim.x, this.spike.sprite.dim.y)
      if(debug.drawHitboxes) {
        ctx.strokeRect(this.spike.pos.x - this.spike.hitbox.x/2 + this.spike.offset.x, this.spike.pos.y - this.spike.hitbox.y/2 + this.spike.offset.y, this.spike.hitbox.x, this.spike.hitbox.y)
      }
    }
    if(!debug.hideSprites) {
      ctx.drawImage(this.sprite.img, this.pos.x - this.sprite.dim.x/2 + this.sprite.offset.x, this.pos.y - this.sprite.dim.y/2 + this.sprite.offset.y, this.sprite.dim.x, this.sprite.dim.y)
    }
    if(debug.drawHitboxes) {
      ctx.strokeStyle = globals.hitboxColor
      ctx.lineWidth = 1
      ctx.strokeRect(this.pos.x - this.hitbox.x/2, this.pos.y - this.hitbox.y/2, this.hitbox.x, this.hitbox.y)
    }

  }
  pass() {
    globals.scrollspeed += 0.8
    this.destroy()
  }
  destroy() {
    if(player.pos.y < globals.scoreBonusMinHeight) {
      globals.score++
      new Overlay("score_plus", {x: this.pos.x, y: this.pos.y}, player)
    }
    if(this.soldier) this.soldier.die()
    platforms = platforms.filter(plat => plat != this)
    gameObjects = gameObjects.filter(obj => obj != this)
    
    
    globals.platformsPassed++
    globals.score++
  }
}