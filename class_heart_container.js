class HeartContainer {
  constructor(
    pos = { x: 0, y: 0 }
  ) {
    this.pos = pos
    this.hitbox = data.heart_container.hitbox
    this.sprite = {
      img: new Image(),
      src: data.heart_container.sprite.default,
      dim: {
        x: data.heart_container.spriteDimensions.x,
        y: data.heart_container.spriteDimensions.y,
      }
    }
    this.sprite.img.src = this.sprite.src
    this.fallSpeedMod = data.heart_container.fallSpeedMod
    gameObjects.push(this)
    collectibles.push(this)
  }

  pickup() {
    player.mods.umbrella = true
    player.standing = false
    setTimeout(()=> {
      player.mods.umbrella = false
    },data.umbrella.duration)
    this.destroy()
  }
  destroy() {
    gameObjects = gameObjects.filter(obj => obj != this)
    collectibles = collectibles.filter(obj => obj != this)
  }
  update() {
    this.pos.y += globals.scrollspeed * dt * this.fallSpeedMod
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