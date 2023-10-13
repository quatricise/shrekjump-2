class Cloud {
  constructor(
    pos = { x: 0, y: 0 }
  ) {
    this.pos = pos
    this.hitbox = data.cloud.hitbox
    this.sprite = {
      img: new Image(),
      src: data.cloud.sprite.default,
      dim: {
        x: data.cloud.spriteDimensions.x,
        y: data.cloud.spriteDimensions.y,
      }
    }
    this.offset = data.cloud.offset
    this.sprite.img.src = this.sprite.src
    this.fallSpeedMod = data.cloud.fallSpeedMod
    gameObjects.push(this)
    collectibles.push(this)
  }
  pickup() {
    //basically if the player is moving up compared to the clouds, and has an umbrella, the clouds don't affect them
    if(
      player.mods.umbrella && 
      (player.jumping || player.vel.y < globals.scrollspeed * globals.scrollSpeedMod * data.cloud.fallSpeedMod) //fallspeedmod because that's just how fast clouds move
    ) {
      this.destroy()
    }
    else {
      player.speedMod -= data.cloud.speedReduction
      player.clouded = true
      player.timers.clouded = data.cloud.duration
      this.destroy()
      new SFX("shrek_no")
    }
  }
  destroy() {
    gameObjects = gameObjects.filter(obj => obj != this)
    collectibles = collectibles.filter(obj => obj != this)
  }
  update() {
    this.pos.y += globals.scrollspeed * dt * globals.scrollSpeedMod * this.fallSpeedMod
    if((this.pos.y - this.hitbox.y/2) > ch) this.destroy()
  }
  draw() {
    if(debug.drawHitboxes) {
      ctx.strokeStyle = colors.hitboxColor
      ctx.lineWidth = 1
      ctx.strokeRect(this.pos.x - this.hitbox.x/2, this.pos.y - this.hitbox.y/2, this.hitbox.x, this.hitbox.y)
    }

    if(!debug.hideSprites) {
      ctx.drawImage(this.sprite.img, this.pos.x - this.sprite.dim.x/2, this.pos.y - this.sprite.dim.y/2, this.sprite.dim.x, this.sprite.dim.y)
    }
  }
}
