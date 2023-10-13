function init() {
  if(!loaded.fonts) return;
  if(!loaded.images) return;
  lastTime = Date.now()
  gameObjects = []
  platforms = []
  soldiers = []
  collectibles = []
  explosions = []
  overlays = []
  globals = _.cloneDeep(globals_default)
  globals.paused = false
  globals.started = true
  chance = {
    ...chance_default
  }
  platform_weights = {
    ...platform_weights_default
  }
  currentStage = new Stage("test")
  new PlatformSpawner()

  console.log(`To-do's in code, search //todo`)
  ctx.filter = "none"
  new PlatformBasic(
    {
      x: rand( 
      cw/2 + rand(0, globals.maxPlatformSpread), 
      cw/2 - rand(0, globals.maxPlatformSpread)
      ),
      y: ch - 200,
    },
    false
  )
  new PlatformBasic(
    {
      x: rand( 
      cw/2 + rand(0, globals.maxPlatformSpread), 
      cw/2 - rand(0, globals.maxPlatformSpread)
      ),
      y: ch - 450,
    },
    false
  )
  new PlatformBasic(
    {
      x: rand( 
      cw/2 + rand(0, globals.maxPlatformSpread), 
      cw/2 - rand(0, globals.maxPlatformSpread)
      ),
      y: ch - 700,
    },
    false
  )
  new PlatformBasic(
    {
      x: rand( 
      cw/2 + rand(0, globals.maxPlatformSpread), 
      cw/2 - rand(0, globals.maxPlatformSpread)
      ),
      y: ch - 950,
    },
    false
  )
  player = new Shrek({x: platforms[1].pos.x, y: 400})
  draw()
}