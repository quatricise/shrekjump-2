class Boulder {
  constructor(
    pos = { x: 0, y: 0 }
  ) {
    this.pos = pos
    this.hitbox = data.boulder.hitbox
    this.sprite = {
      img: new Image(),
      src: data.boulder.sprite.default,
      dim: {
        x: data.boulder.spriteDimensions.x,
        y: data.boulder.spriteDimensions.y,
      }
    }
    this.rotation = 0 // deg
    this.rotationSpeed = pickRand([-60,-50,-40,-30,30,40,50,60])
    this.offset = data.boulder.offset
    this.sprite.img.src = this.sprite.src
    this.fallSpeedMod = data.boulder.fallSpeedMod
    gameObjects.push(this)
    fallingObjects.push(this)
  }
  update() {
    this.pos.y += globals.scrollspeed * globals.scrollSpeedMod * this.fallSpeedMod * dt
    if(this.pos.y + this.hitbox.y/2 > ch) this.destroy()

    this.rotation += (this.rotationSpeed*PI/180) * dt
    if(this.rotation >= 360) this.rotation = 0


  }
  destroy() {
    gameObjects = gameObjects.filter(obj => obj != this)
    fallingObjects = fallingObjects.filter(obj => obj != this)
  }
  draw() {
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.rotate(this.rotation)
    if(debug.drawHitboxes) {
      ctx.strokeStyle = colors.hitboxColor
      ctx.lineWidth = 1
      ctx.strokeRect(0 - this.hitbox.x/2, 0 - this.hitbox.y/2, this.hitbox.x, this.hitbox.y)
    }

    if(!debug.hideSprites) {
      ctx.drawImage(this.sprite.img, 0 - this.sprite.dim.x/2, 0 - this.sprite.dim.y/2, this.sprite.dim.x, this.sprite.dim.y)
    }
    ctx.restore()
  }
}