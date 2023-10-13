class Stage {
  constructor(name) {
    this.name = name
    this.scrollspeed = data.stage[name].scrollspeed
    this.canSpawn = data.stage[name].canSpawn
  }
  load() {
    globals.scrollspeed = this.scrollspeed 
    globals.score = 0
    globals.platformsPassed = 0
    
  }
}