class Heart {
  constructor(
    type = "regular",
    pos = { x: 0, y: 0 }
  ) {
    this.type = type
    this.pos = pos
    this.hitbox = data.heart.hitbox
    this.sprite = {
      img: new Image(),
      src: data.heart.sprite[type],
      dim: {
        x: data.heart.spriteDimensions.x,
        y: data.heart.spriteDimensions.y,
      }
    }
    this.offset = data.heart.offset
    this.sprite.img.src = this.sprite.src
    this.fallSpeedMod = data.heart.fallSpeedMod
    gameObjects.push(this)
    collectibles.push(this)
    if(type === "golden") globals.goldenHeartsSpawned++
  }
  pickup() {
    if(this.type === "golden") {
      player.lifeMax++
      player.getHeart()
      globals.score += 5
      new Overlay("score_plus_five", undefined, player)
    }
    if(this.type === "regular") {
      player.getHeart()
      globals.score++
      new Overlay("score_plus", undefined, player)
    }
    this.destroy()
    
    new SFX("shrek_yes")
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