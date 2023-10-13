class Shrek {
  constructor(pos = { x: 0, y: 0 }) {
    this.pos = pos
    this.hitbox = data.shrek.hitbox
    this.sprite = {
      img: new Image(),
      src: data.shrek.sprite.default,
      dim: {
        x: data.shrek.spriteDimensions.x,
        y: data.shrek.spriteDimensions.y,
      },
      offset: data.shrek.spriteOffset
    }
    this.offset = data.shrek.offset
    this.sprite.img.src = this.sprite.src
    this.speed = data.shrek.speed
    this.speedMod = 1
    this.vel = {
      x: 0,
      y: 0
    }
    this.maxVel = {
      x: data.shrek.speed,
      y: globals.fallSpeed
    }
    this.life = data.shrek.life
    this.lifeMax = data.shrek.lifeMax
    this.stamina = data.shrek.stamina
    this.staminaMax = this.stamina
    this.staminaColor = colors.stamina_high
    this.onions = 0
    this.standing = false
    this.standingOn = null // platform reference
    this.facing = "front"
    this.invulnerable = false
    this.dead = false
    this.jumping = false
    this.jumpingPreviously = false
    this.super_jump_active = false
    this.sliding = false
    this.falling = false
    this.clouded = false
    this.exploded = false
    this.dash = {
      active: false,
      onCooldown: false,
      direction: "none",
      progress: 0,
      prevOffset: 0,
    }
    this.canJump = false
    this.jumpBoost = true
    this.jump_window = {
      active: false,
      frames: 0,
    }
    this.mods = {
      umbrella: false,
      umbrella_super: false,
      onion: false,
    }
    this.timers = {
      invulnerable: 0,
      super_jump_window: 0,
      pre_super_jump_window: 0,
      can_regain_stamina: 0,
      onion: 0,
      dash: 0,
      umbrella: 0,
      clouded: 0,
      immobilize: 0, //this acts as a hampering effect on movement, im not sure it's even used anymore
    }
  }
  activateJump() {
    this.timers.pre_super_jump_window = 40
    if(this.timers.super_jump_window > 0 && !this.super_jump_active && this.stamina > 30) {
      this.super_jump_active = true
      this.jumping = true
      this.standing = false
      console.log('Shrekjump!')
      new Overlay("shrek_super_jump", {...this.pos})
    }
  }
  jump() {
    if(!this.standing && !this.jumping && !this.canJump) return
    if(this.stamina <= 0) {
      this.jumping = false
      this.super_jump_active = false
      return
    }

    if(keys.jump) {
      this.jumping = true
    } 
    else {
      this.jumping = false;
      return
    }

    if(!this.standing && !this.jumping) { 
      this.falling = true 
      return 
    }
    this.falling = false
    this.sliding = false
    this.standingOn = null
    let maxvel = data.shrek.maxJumpVel * (this.stamina/this.staminaMax + 0.22) * ((this.super_jump_active * 1) + 1)
    this.vel.y -= maxvel
    if(Math.abs(this.vel.y) > maxvel) {
      this.vel.y = -maxvel
    }
    this.stamina -= 65 * dt
  }
  fall() {
    //#region Guard Clauses
    if(this.dash.active) return
    if(this.jumping) return

    if(this.standing) {
      this.vel.y = globals.scrollspeed
      return
    }
    this.falling = true
    this.super_jump_active = false
    this.sliding = false
    if((this.pos.y + this.hitbox.y/2) > ch) {
      if(this.life > 1) this.explode()
      else this.die()
      return
    }
    if(this.exploded && this.vel.y > 0) this.exploded = false //!!!! stops being exploded once it starts falling again

    if(this.mods.umbrella && !keys.quickfall && !this.exploded ) {
      this.vel.y += (globals.fallSpeed) * globals.umbrellaFallSmoothing * (1 - data.umbrella.fallReduction)
      if(this.vel.y > Math.abs(this.maxVel.y) * (1 - data.umbrella.fallReduction)) {
        this.vel.y = this.maxVel.y * (1 - data.umbrella.fallReduction)
      }
      return
    } 
    else 
    if(this.mods.umbrella && keys.quickfall && !this.exploded)
    {
      this.vel.y += (globals.fallSpeed) * globals.umbrellaFallSmoothing * (1 - data.umbrella.fallReduction)
      if(this.vel.y > Math.abs(this.maxVel.y)) {
        this.vel.y = this.maxVel.y * globals.fallSpeedMod
      }
      return
    }
    //#endRegion

    if(keys.quickfall && !this.exploded) {
      this.vel.y += globals.fallSpeed * globals.fallSpeedMod * globals.fallSmoothing
      if(this.vel.y > Math.abs(this.maxVel.y) * globals.fallSpeedMod) {
        this.vel.y = this.maxVel.y * globals.fallSpeedMod
      }
    }
    else 
    if(!keys.quickfall && !this.exploded) {
      this.vel.y += globals.fallSpeed * globals.fallSmoothing
      if(this.vel.y > Math.abs(this.maxVel.y)) {
        this.vel.y = this.maxVel.y
      }
    } 
    else
    if(keys.quickfall && this.exploded) {
      this.vel.y += globals.fallSpeed * globals.explosionFalloff * dt
    }
    else 
    if(!keys.quickfall && this.exploded) {
      this.vel.y += globals.fallSpeed * globals.explosionFalloff * dt
    }
  }
  move() {
    if(this.dash.active) return;

    let offset = (this.speed * this.speedMod) * (1 - globals.speedSmoothing)
    if(this.timers.immobilize > 0) {
      offset *= 1 - this.timers.immobilize/data.platforms.explosive.immobilizeFor/(20 * this.timers.immobilize/data.platforms.explosive.immobilizeFor)
    }

    if(this.sliding) offset *= 1 - data.platforms.icy.friction

    if(keys.left && !keys.right) {
      this.vel.x -= offset
      
      if(this.vel.x < -this.maxVel.x * this.speedMod) {
        this.vel.x = this.maxVel.x * -1 * this.speedMod
      }
      this.facing = "left"
    }
    if(keys.right && !keys.left) {
      this.vel.x += offset
      
      if(this.vel.x > this.maxVel.x * this.speedMod) {
        this.vel.x = this.maxVel.x * this.speedMod
      }
      this.facing = "right"
    }

    if(!keys.left && !keys.right) {
      this.facing = "front"
    }

    if(!keys.left && !keys.right && !this.exploded && !this.sliding) {
      this.vel.x *= 0.6 * dt
      if(Math.abs(this.vel.x) < 0.05) this.vel.x = 0
    }
    if(!keys.left && !keys.right && this.exploded && !this.sliding) {
      this.vel.x *= globals.explosionXFalloff
      if(Math.abs(this.vel.x) < 0.05) this.vel.x = 0
    }
    if(!keys.left && !keys.right && !this.exploded && this.sliding) {
      this.vel.x *= data.platforms.icy.friction

    }
  }
  stand() {
    if(this.falling) {
      this.stamina = Math.min(this.staminaMax, this.stamina + this.staminaMax/2)
      this.timers.super_jump_window = 90
      this.timers.can_regain_stamina = 0
      if(debug.consoleMessages) console.log("stood, gained + 20 stamina")
    }
    this.falling = false
    this.super_jump_active = false
    this.standing = true
    this.vel.y = 0
    this.pos.y = this.standingOn.pos.y - (this.standingOn.hitbox.y/2) - this.hitbox.y/2 + 1
    if(this.timers.pre_super_jump_window > 0) {
      this.activateJump()
    }
  }
  restoreStamina() {
    if(this.stamina >= this.staminaMax) return
    if(this.timers.can_regain_stamina > 0) return
    if(this.jumping) return
    if(this.falling) {
      this.stamina = Math.min(this.staminaMax, this.stamina + (data.shrek.stamina_recharge/3 * dt))
      return
    }
    if(!this.mods.onion) this.stamina += data.shrek.stamina_recharge * dt
    else
    if(this.mods.onion) {
      this.stamina += this.staminaMax / 4 
    }
    if(this.stamina > this.staminaMax) this.stamina = this.staminaMax
  }
  dashActivate() {
    if(this.dash.active) return
    if(this.dash.onCooldown) return
    this.vel.y = 0
    this.dash.progress = 0
    this.dash.active = true

    this.dash.onCooldown = true
    this.timers.dash =  data.shrek.dash.cooldown

    if(this.facing === "left") {
      this.dash.direction = "left"
    }
    if(this.facing === "right") {
      this.dash.direction = "right"
    }
  }
  dashTick() {
    if(!this.dash.active) return
    this.falling = false

    let totalOffset = easeLinear(this.dash.progress, 0, data.shrek.dash.distance, data.shrek.dash.duration)
    let step = totalOffset - this.dash.prevOffset

    if(this.dash.progress > data.shrek.dash.duration/2) {
      step *= 0.5 + (1 - (this.dash.progress/ data.shrek.dash.duration))/2
      // console.log(step)
    }
    this.vel.x = 0
    
    if(this.dash.direction === "left") {
      this.pos.x -= step
    }
    if(this.dash.direction === "right") {
      this.pos.x += step
    }


    this.dash.prevOffset = totalOffset
    this.dash.progress += dt * 1000
    if(this.dash.progress >= data.shrek.dash.duration) {
      this.dash.active = false
      this.dash.progress = 0
      this.dash.prevOffset = 0
    }
  }
  takeDamage() {
    if(this.invulnerable) return
    this.life--
    this.invulnerable = true
    this.timers.invulnerable = data.shrek.invulnerableWindow
    if(this.life <= 0) this.die()
  }
  getHeart() {
    if(this.life >= this.lifeMax) return
    player.life++
  }
  eat() {
    if(!this.onions) return
    this.onions--
    this.mods.onion = true
    this.timers.onion = data.onion.duration

    new SFX("shrek_eat")
  }
  die() { 
    this.dead = true
  }
  explode() {
    let vel = {
      x: this.vel.x,
      y: data.platforms.explosive.explosionStrength * -1
    }
    this.exploded = true
    this.jumping = false
    this.falling = true
    this.standing = false
    this.mods.umbrella = false
    this.mods.umbrella_super = false
    this.timers.immobilize = data.platforms.explosive.immobilizeFor
    this.takeDamage()

    if(globals.randomExplosions) {
      vel = vectorRotate(vel.x, vel.y, randR(-data.platforms.explosive.angleVariance, data.platforms.explosive.angleVariance) * PI / 180)
      this.vel = vel
    }
    else {
      this.vel.y = vel.y
    }
  }
  checkCollision() {
    if(
      ((!this.jumping && !this.exploded && !this.mods.umbrella) 
      || 
      (this.standing && this.mods.umbrella) 
      || 
      (this.falling && this.mods.umbrella && keys.quickfall)) 
      &&
      !this.jumping
    ) {
      let isStandingNow = false;
      platforms.forEach(plat => {
        if(isStandingNow) return
        if(
          boxCollision(this, plat, 1, 3)
          &&
          this.pos.y + this.hitbox.y/2 > plat.pos.y - plat.hitbox.y/2 - globals.landingBufferHeight - (keys.quickfall * globals.landingBufferHeight)
          &&
          this.pos.y + this.hitbox.y/2 < plat.pos.y - plat.hitbox.y/2 + globals.landingBufferHeight + (keys.quickfall * globals.landingBufferHeight)
        ) {
          if(this.falling) plat.playerLandedCount++
          if(plat instanceof PlatformIcy && this.falling) plat.crack()
          isStandingNow = true
          this.standingOn = plat
          this.stand()

          if(plat instanceof PlatformTimed) plat.activated = true
          if(plat instanceof PlatformExplosive) plat.explode()
        }
      })
      if(!isStandingNow) {
        this.standing = false
        this.standingOn = null
      }
    }
    
    platforms.forEach(plat => {
      if(!plat.spike.exists) return
      if(boxCollision(this, plat.spike)) {
        this.takeDamage()
      }
    })
    collectibles.forEach(coll => {
      if( boxCollision(this, coll)) {
        coll.pickup()
      }
    })
    
    soldiers.forEach(soldier=> {
      if(boxCollision(this, soldier.attackArea)) {
        this.takeDamage()
      }
      if(boxCollision(this, soldier)) {
        soldier.die()
      }
    })
    fallingObjects.forEach(obj=> {
      if(boxCollision(this, obj)) {
        if(!this.mods.umbrella) this.takeDamage()
        this.mods.umbrella = false
        this.mods.umbrella_super = false
        obj.destroy()
      }
    })
  }
  updateScrollSpeed() {
    globals.scrollSpeedMod = 1.25 - (this.pos.y/(ch*2))
  }
  updatePose() {
    let src = images.shrek.front
    if(this.facing === "left" && this.standing) {
      src = images.shrek.left
    }
    if(this.facing === "right" && this.standing) {
      src = images.shrek.right
    }
    if(this.facing === "front" && this.standing) {
      src = images.shrek.front
    }
    src = src.slice(0, src.length - 4 )
    if(this.jumping) src += "_jump"
    else
    if(this.falling && !keys.quickfall) src += "_jump"
    else
    if(this.falling && keys.quickfall) {
      src = images.shrek.quickfall
      src = src.slice(0, src.length - 4 )
    }
    if(this.timers.dash <= 0) src += "_dashready"
    src += ".png"
    this.sprite.img.src = src
  }
  updateStaminaMeter() {
    if(this.stamina > this.staminaMax/1.4)  this.staminaColor  = colors.stamina_high
    if(this.stamina <= this.staminaMax/1.4) this.staminaColor  = colors.stamina_medium
    if(this.stamina <= this.staminaMax/3) this.staminaColor  = colors.stamina_low
  }
  updatePosition() {
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
    if((this.pos.x - this.hitbox.x/2) < 0) {
      this.vel.x = 0
      this.pos.x = 0 + this.hitbox.x/2
    }
    if((this.pos.x + this.hitbox.x/2) > cw) {
      this.vel.x = 0
      this.pos.x = cw - this.hitbox.x/2
    }
  }
  checkSliding() {
    if(this.standingOn && this.standingOn instanceof PlatformIcy) this.sliding = true
    else this.sliding = false
  }
  countdownFX() {
    if(this.timers.invulnerable > 0) this.timers.invulnerable -= 1000 * dt
    if(this.timers.invulnerable <= 0) {
      this.timers.invulnerable = 0
      this.invulnerable = false
    }
    if(this.timers.clouded > 0) this.timers.clouded -= 1000 * dt
    if(this.timers.clouded <= 0) {
      this.speedMod = 1
      this.clouded = false
    }
    this.speedMod = 1 - (this.timers.clouded/data.cloud.duration * data.cloud.speedReduction)

    if(this.timers.immobilize > 0) this.timers.immobilize -= 1000 * dt
    if(this.timers.immobilize <= 0) {
      this.timers.immobilize = 0
    }
    
    if(this.timers.pre_super_jump_window > 0) this.timers.pre_super_jump_window -= 1000 * dt
    if(this.timers.pre_super_jump_window <= 0) {
      this.timers.pre_super_jump_window = 0
    }

    if(this.timers.super_jump_window > 0) this.timers.super_jump_window -= 1000 * dt
    if(this.timers.super_jump_window <= 0) {
      this.timers.super_jump_window = 0
    }

    if(this.timers.can_regain_stamina > 0) this.timers.can_regain_stamina -= 1000 * dt
    if(this.timers.can_regain_stamina <= 0) {
      this.timers.can_regain_stamina = 0
    }

    if(this.timers.umbrella > 0) this.timers.umbrella -= 1000 * dt
    if(this.timers.umbrella <= 0) {
      this.timers.umbrella = 0
      this.mods.umbrella = false
      this.mods.umbrella_super = false
    }

    if(this.timers.onion > 0) this.timers.onion -= 1000 * dt
    if(this.timers.onion <= 0) {
      this.timers.onion = 0
      this.mods.onion = false
    }

    if(this.timers.dash > 0) this.timers.dash -= 1000 * dt
    if(this.timers.dash <= 0) {
      this.timers.dash = 0
      this.dash.onCooldown = false
    }
  }
  update() {
    this.jumpingPreviously = this.jumping
    this.countdownFX()
    this.checkSliding()
    this.move()
    this.dashTick()    
    this.checkCollision()
    this.restoreStamina()
    this.fall()
    let jumping = this.jump()
    if(this.jumpingPreviously && !jumping) this.timers.can_regain_stamina = 750
    this.updateStaminaMeter()
    this.updatePosition()
    this.updateScrollSpeed()
    this.updatePose()
  }
  draw() {
    if(this.invulnerable) {
      ctx.save()
      ctx.filter = `saturate(0) brightness(${
        (Math.sin(this.timers.invulnerable/(data.shrek.invulnerableWindow*0.05)) + 1)*0.25 + 0.75
      })`
    }
    
    if(this.mods.umbrella_super || this.mods.umbrella) {
      ctx.save()
      let img
      if(this.mods.umbrella_super) {
        img = new Image(); img.src = images.umbrella.super
        ctx.globalAlpha = Math.max(0, this.timers.umbrella/data.umbrella.variants["super"].duration)
      }
      else {
        img = new Image(); img.src = images.umbrella.default
        ctx.globalAlpha = Math.max(0, this.timers.umbrella/data.umbrella.variants["default"].duration)
      }
      ctx.drawImage(
        img, 
        this.pos.x - data.shrek.umbrellaIndicator.size.x/2, 
        this.pos.y - this.hitbox.y/2 - data.shrek.umbrellaIndicator.size.y, 
        data.shrek.umbrellaIndicator.size.x, 
        data.shrek.umbrellaIndicator.size.y 
      )
      ctx.restore()
    }


    if(!debug.hideSprites) {
      if(this.mods.onion && !this.invulnerable) {
        ctx.save()
        ctx.filter = "sepia(80%)"
        console.log(ctx.filter)
      }
      ctx.drawImage(this.sprite.img, this.pos.x - this.sprite.dim.x/2 + this.sprite.offset.x, this.pos.y - this.sprite.dim.y/2 + this.sprite.offset.y, this.sprite.dim.x, this.sprite.dim.y)

    }
    
    if(debug.drawHitboxes) {
      ctx.strokeStyle = colors.hitboxColor
      ctx.lineWidth = 1
      ctx.strokeRect(this.pos.x - this.hitbox.x/2 + this.offset.x, this.pos.y - this.hitbox.y/2 + this.offset.y, this.hitbox.x, this.hitbox.y)
    }

    //stamina
    {
      ctx.save()
      ctx.translate(data.shrek.staminaIndicator.offset.x,data.shrek.staminaIndicator.offset.y)
      
      let padding = data.shrek.staminaIndicator.padding
      let size = data.shrek.staminaIndicator.size
      let minHeight = data.shrek.staminaIndicator.minHeight
      //border
      ctx.beginPath()
      ctx.rect(
        this.pos.x - size.x/2,
        (this.pos.y - size.y/2) + (size.y + minHeight) * (1 - this.stamina/this.staminaMax) - minHeight,
        size.x,
        size.y * (this.stamina/this.staminaMax) + minHeight
      )
      ctx.fillStyle = colors.stamina_outline
      ctx.fill()
      ctx.closePath()
      //inner part
      ctx.beginPath()
      ctx.rect(
        this.pos.x - size.x/2 + padding,
        (this.pos.y - size.y/2) + (size.y + minHeight) * (1 - this.stamina/this.staminaMax) + padding - minHeight, 
        size.x - padding * 2, 
        (size.y) * (this.stamina/this.staminaMax) - (padding * 2) + minHeight
      )
      ctx.fillStyle = this.staminaColor
      ctx.fill()
      ctx.closePath()

      ctx.restore()
    }
    if(this.mods.onion) {
      ctx.restore()
    }
    if(this.invulnerable) {
      ctx.restore()
    }

    if(globals.showPositionIndicator && (this.pos.y < 0 - this.hitbox.y/2 - 20)) {
      ctx.beginPath()
      ctx.fillStyle = "black"
      ctx.arc(this.pos.x, 25, 4, 0, PI*2)
      ctx.fill()
      ctx.closePath()
    }
  }
}