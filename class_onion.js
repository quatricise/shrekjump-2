class Onion {
  constructor(
    pos = { x: 0, y: 0 }
  ) {
    this.pos = pos
    this.hitbox = data.onion.hitbox
    this.sprite = {
      img: new Image(),
      src: data.onion.sprite.default,
      dim: {
        x: data.onion.spriteDimensions.x,
        y: data.onion.spriteDimensions.y,
      }
    }
    this.offset = data.onion.offset
    this.sprite.img.src = this.sprite.src
    this.fallSpeedMod = data.onion.fallSpeedMod
    gameObjects.push(this)
    collectibles.push(this)
  }
  pickup() {
    player.onions++
    let rand = Math.ceil(Math.random() * 2)
    new SFX("shrek_getonion" + rand)
    
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
