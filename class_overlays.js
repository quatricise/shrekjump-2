class Overlay {
  constructor(type, pos = {x: 0, y: 0}, parent = null) {
    this.pos = pos
    this.parent = parent
    this.sprite = {
      img: new Image(),
      src: data.overlays[type].sprite.default,
      dim: data.overlays[type].spriteDimensions
    }
    this.sprite.img.src = data.overlays[type].sprite.default
    this.offset = {
      x: data.overlays[type].offset.x + randR(-data.overlays[type].offsetRandom.x, data.overlays[type].offsetRandom.x),
      y: data.overlays[type].offset.y + randR(-data.overlays[type].offsetRandom.y, data.overlays[type].offsetRandom.y)
    }
    this.life = data.overlays[type].life
    this.lifeMax = this.life
    gameObjects.push(this)
    overlays.push(this)
  }
  update() {
    if(this.parent) this.pos = this.parent.pos
    this.life -= 1000 * dt
    if(this.life <= 0) this.destroy()
  }
  draw() {
    if(!debug.hideSprites) {
      ctx.save()
      ctx.globalAlpha = Math.max(0, this.life/this.lifeMax)
      ctx.translate(this.pos.x + this.offset.x, this.pos.y + this.offset.y)
      ctx.drawImage(
        this.sprite.img, 
        0 - this.sprite.dim.x/2, 
        0 - this.sprite.dim.y/2, 
        this.sprite.dim.x, 
        this.sprite.dim.y
      )
      ctx.restore()
    }
  }
  destroy() {
    overlays = overlays.filter(obj => obj != this)
    gameObjects = gameObjects.filter(obj => obj != this)
  }
}