class Spike {
  constructor(attachedTo, single, double) {
    this.attachedTo = attachedTo
    this.sprite = {
      img: new Image(),
      src: data.spike.sprite.default,
      dim: data.spike.spriteDimensions,
      offset: data.spike.spriteOffset,
    }
    this.offset = data.spike.offset
  }
}