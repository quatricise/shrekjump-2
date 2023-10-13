class SFX {
  constructor(name) {
    this.sound = new Audio()
    this.sound.src = sounds[name]
    this.sound.play()
  }
}