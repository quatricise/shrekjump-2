class Explosion {
  constructor(pos = {x: 0, y: 0}) {
    this.pos = pos
    this.life = data.explosion.life
    this.lifeMax = data.explosion.life
    this.sprite = {
      img: new Image(),
      src: data.explosion.sprite.default,
      dim: _.cloneDeep(data.explosion.spriteDimensions),
      offset: _.cloneDeep(data.explosion.spriteOffset)
    }
    this.sprite.img.src = this.sprite.src
    gameObjects.push(this)
    explosions.push(this)
  }
  update() {
    this.life -= 1000 * dt
    this.pos.y += globals.scrollspeed * globals.scrollSpeedMod * dt
    if(this.life <= 0) this.destroy()
  }
  destroy() {
    explosions = explosions.filter(plat => plat != this)
    gameObjects = gameObjects.filter(obj => obj != this)
  }
  draw() {
    ctx.save()
    ctx.translate(this.pos.x, this.pos.y)
    ctx.globalAlpha = Math.max(0, this.life/this.lifeMax)
    if(!debug.hideSprites) {
      ctx.drawImage(this.sprite.img, 0 - this.sprite.dim.x/2 + this.sprite.offset.x, 0 - this.sprite.dim.y/2 + this.sprite.offset.y, this.sprite.dim.x, this.sprite.dim.y)
    }

    ctx.restore()
  }
}