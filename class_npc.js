// class Boulderman{
//   constructor(parent) {
//     this.parent = parent
//     this.sprite = {
//       img: new Image(),
//       src: data.npc.boulderman
//     }
//   }
//   update() {

//   }
//   attack() {

//   }
//   draw() {

//   }
//   die() {

//   }
// }


class Javelineer {
  constructor(parent) {
    this.parent = parent
    this.pos = this.parent.pos
    this.sprite = {
      img: new Image(),
      src: data.npc.javelineer.sprite.right,
      dim: data.npc.javelineer.spriteDimensions,
      offset: data.npc.javelineer.spriteOffset
    }
    this.sprite.img.src = this.sprite.src
    this.hitbox = data.npc.javelineer.hitbox
    this.attackArea = JSON.parse(JSON.stringify(data.npc.javelineer.attackArea))
    this.offset = data.npc.javelineer.offset
    this.parent.soldier = this
    this.facing = "right"
    this.timers = {
      turn: data.npc.javelineer.turnFrequency
    }
    gameObjects.push(this)
    soldiers.push(this)
  }
  update() {
    this.pos = this.parent.pos
    this.attackArea.pos = {
      x: this.parent.pos.x + data.npc.javelineer.offset.x,
      y: this.parent.pos.y + data.npc.javelineer.offset.y,
    }
    this.updateTimers()
  }
  attack() {

  }
  turn() {
    // the attack area hitbox needs to be mirrored, 
    // it'll literally recalculate the hitbox, so it's easier to do collision in Shrek class
    if(this.facing === "right") {
      this.facing = "left"
      this.sprite.img.src = data.npc.javelineer.sprite.left
    }
    else
    if(this.facing === "left") {
      this.facing = "right"
      this.sprite.img.src = data.npc.javelineer.sprite.right
    }
    this.attackArea.offset.x *= -1
    this.attackArea.offset.y *= -1

  }
  updateTimers() {
    this.timers.turn -= 1000 * dt
    if(this.timers.turn <= 0) {
      this.turn()
      this.timers.turn = data.npc.javelineer.turnFrequency
    }
  }
  draw() {
    if(!debug.hideSprites) {
      ctx.drawImage(this.sprite.img, this.pos.x - this.sprite.dim.x/2 + this.offset.x + this.sprite.offset.x, this.pos.y - this.sprite.dim.y/2 + this.offset.y + this.sprite.offset.y, this.sprite.dim.x, this.sprite.dim.y)
    }
    if(debug.drawHitboxes) {
      ctx.save()
      ctx.translate(this.pos.x + this.offset.x, this.pos.y + this.offset.y)
      ctx.strokeStyle = colors.hitboxColor
      ctx.lineWidth = 1
      //entity hitbox
      ctx.strokeRect(
        0 - this.hitbox.x/2, 
        0 - this.hitbox.y/2, 
        this.hitbox.x, 
        this.hitbox.y
      )
      //attack area hitbox 
      ctx.restore()

      ctx.save()
      ctx.translate(this.attackArea.pos.x, this.attackArea.pos.y)
      ctx.strokeRect(
        0 - this.attackArea.hitbox.x/2 + this.attackArea.offset.x, 
        0 - this.attackArea.hitbox.y/2 + this.attackArea.offset.y, 
        this.attackArea.hitbox.x, 
        this.attackArea.hitbox.y
        )
      ctx.restore()
    }
    
  }
  die() {
    globals.score++
    new Overlay("score_plus", undefined, player)
    gameObjects = gameObjects.filter(obj => obj != this)
    soldiers = soldiers.filter(plat => plat != this)
  }
}
