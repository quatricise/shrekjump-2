class Umbrella {
  constructor(
    pos = { x: 0, y: 0 },
    type = "default",
  ) {
    this.pos = pos
    this.type = type
    this.hitbox = data.umbrella.hitbox
    this.sprite = {
      img: new Image(),
      src: data.umbrella.sprite[type],
      dim: _.cloneDeep(data.umbrella.spriteDimensions),
      offset: _.cloneDeep(data.umbrella.spriteOffset)
    }
    this.offset = data.umbrella.offset
    this.sprite.img.src = this.sprite.src
    this.fallSpeedMod = data.umbrella.fallSpeedMod
    gameObjects.push(this)
    collectibles.push(this)
  }
  pickup() {
    player.mods.umbrella = true
    if(this.type === "super") player.mods.umbrella_super = true
    else player.mods.umbrella_super = false
    player.standing = false
    player.timers.umbrella = data.umbrella.variants[this.type].duration
    globals.score++
    new Overlay("score_plus", undefined, player)
    this.destroy()
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
