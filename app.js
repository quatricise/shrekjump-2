let drawId;
let player;

const canvas = Q('#canvas')
const ctx = canvas.getContext('2d')


let cw = 372
let ch = window.innerHeight - 270
canvas.width = cw
canvas.height = ch
window.onresize = () => {
  ch = window.innerHeight
}

let patch_version = "1.4.0"

let patch_info = 
`Added Shrekjump™ - after landing you have 75ms to perform a super jump, it only works if you have stamina over 20%.
`
Q('.patch-info').innerText = patch_version +  ": " + "\n" + patch_info

let imagesTotal = 0;
let imagesLoadedCount = 0;
let loaded = {
  images: false,
  fonts: false,
}

function loadImages() {
  let groupKeys = Object.keys(images)
  for (let i = 0; i < groupKeys.length; i++) {
    let group = images[groupKeys[i]]
    if(debug.consoleMessages) console.log(group)
    let itemKeys = Object.keys(group)
    if(debug.consoleMessages) console.log(itemKeys)
    for (let j = 0; j < itemKeys.length; j++) {
      let item = group[itemKeys[j]]
      imagesTotal++
      let img = new Image()
      img.src = item
      img.onload = () => {
        imagesLoadedCount++
        if(imagesLoadedCount >= imagesTotal) {
          loaded.images = true
          drawBackground()
        }
      }
      if(debug.consoleMessages) console.log(itemKeys[itemKeys[j]])
    }
  }
}


function loadSounds() {
  let itemKeys = Object.keys(sounds)
  if(debug.consoleMessages) console.log("sounds item keys: " + itemKeys)
  for (let j = 0; j < itemKeys.length; j++) {
    let item = sounds[itemKeys[j]]
    let audio = new Audio()
    audio.src = item
  }
}

async function loadFonts() {

  var font1 = new FontFace('shrek', 'url(./fonts/shrek.ttf)');
  await font1.load()

  {
    var font2 = new FontFace('impact', 'url(./fonts/impact.ttf)');
    await font2.load()
    content_fonts.push("impact")  
    var font3 = new FontFace('impact', 'url(./fonts/04B_30__.ttf)');
    await font3.load()
    content_fonts.push("04b")  
  }
  // Ready to use the font in a canvas context
  // console.log('Fonts ready.');
  
  // Add font on the html page
  document.fonts.add(font1);
  loaded.fonts = true
  fonts.score = 'shrek';
}

loadImages()
loadSounds()
loadFonts()

let gameObjects = []
let platforms = []
let collectibles = []
let fallingObjects = []
let explosions = []
let overlays = []
let soldiers = []

let sessionData = [gameObjects, platforms, collectibles, overlays, soldiers]

let dt;
let lastTime;

function draw() {
  drawId = requestAnimationFrame(draw)
  let now = Date.now()
  dt = (now - lastTime) / 1000
  lastTime = now
  
  //update
  gameObjects.forEach((obj)=> {
    obj.update()
  })
  player.update()
  if(player.dead) gameOver()
  //collision

  //draw
  
  drawBackground()
  explosions.forEach( obj => {
    obj.draw()
  })
  soldiers.forEach( obj => {
    obj.draw()
  })
  platforms.forEach( obj => {
    obj.draw()
  })
  collectibles.forEach( obj => {
    obj.draw()
  })
  fallingObjects.forEach( obj => {
    obj.draw()
  })
  player.draw()
  updateUI()
  
  drawOverlays()
  overlays.forEach( obj => {
    obj.draw()
  })
  drawScore()
  drawVersionInfo()
  
  if(globals.gameover) showGameoverScreen()
}

function drawBackground() {
  ctx.fillStyle = "#aaaaaa";
  ctx.fillRect(0,0, cw, ch)
  let bg = new Image(); bg.src = images.background.default;
  ctx.drawImage(bg, 0,0, bg.naturalWidth, bg.naturalHeight)
}

function drawOverlays() {
  if(player.clouded) {
    let img = new Image(); img.src = images.overlay_clouded.default
    ctx.save() 
    ctx.globalAlpha = Math.max(0, player.timers.clouded / data.cloud.duration)
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalWidth)
    ctx.restore()
  }
}

function drawScore() {
  ctx.font = "20px shrek"
  ctx.fillStyle = colors.score
  ctx.fillText("Score " + globals.score, cw - 130, 43)
  ctx.strokeText("Score " + globals.score, cw - 130, 43)
}
function drawVersionInfo() {
  ctx.font = "13px montserrat"
  ctx.fillStyle = colors.text
  ctx.fillText("Patch: " + patch_version, cw - 80, 12)
}

function showGameoverScreen() {
  ctx.fillStyle = "black"
  ctx.font = "40px shrek"
  ctx.fillText("You Shrek'd", 92, ch/2 - 14)
  ctx.fillText("yourself", 132, ch/2 + 28)
  ctx.font = "22px shrek"
  ctx.fillText("Press R to restart", 105, ch/2 + 80)
  // ctx.font = "16px shrek"
  // ctx.fillText(`Pro tip  You can press R anytime twice to restart quickly`, 50, ch/2 + 50)
}

function pause() {
  if(globals.gameover) return
  globals.paused = !globals.paused
  if(!globals.paused) {
    lastTime = Date.now()
    draw()
  }
  if(globals.paused) {
    drawPauseScreen()
    cancelAnimationFrame(drawId)
  }
    
}

function drawPauseScreen() {
  ctx.font = "40px shrek"
  ctx.fillStyle = colors.score
  ctx.strokeStyle = colors.text
  ctx.fillText("Paused", cw/2 - 80, ch/2 - 20)
  ctx.strokeText("Paused", cw/2 - 80, ch/2 - 20)

  ctx.font = "20px shrek"
  ctx.fillText("Press P to unpause", cw/2 - 110, ch/2 + 25)
  ctx.strokeText("Press P to unpause", cw/2 - 110, ch/2 + 25)
}

function gameOver() {
  ctx.filter = "saturate(0.2)"
  globals.gameover = true
  cancelAnimationFrame(drawId)
}

let stages = [
  {
    background: "assets/stage_1.png"
  },
  {
    background: "assets/stage_2.png"
  },
]

let keys = {
  shift: false,
  ctrl: false,
  left: false,
  right: false,
  up: false,
  down: false,
  quickfall: false,
  jump: false,
  dash: false,
  eat: false,
  restart: false,
  viewControls: false,
  showStartMenu: false,
}

document.addEventListener("keydown", function(e) {
  if(!globals.started && !rebind.active && e.code !== binds.returnToTitle) return

  if(rebind.active) {
    binds[rebind.bind] = e.code
    console.log(binds)
    rebind.visual_label.innerText = e.code
    rebind.active = false
    return
  }
  //reset warnings
  if(e.code !== binds.restart) {
    globals.restartWarning = false
  }
  if(e.code !== binds.returnToTitle) {
    globals.quitWarning = false
  }
  //regular keypress code
  if(e.code == binds.left) {
    keys.left = true
  }
  if(e.code == binds.right) {
    keys.right = true
  }
  if(e.code == binds.up) {
    keys.up = true
  }
  if(e.code == binds.down) {
    keys.down = true
  }
  if(e.code == binds.quickfall) {
    keys.quickfall = true
  }
  if(e.code == binds.jump) {
    keys.jump = true
    player.activateJump()
  }
  if(e.code == binds.dash) {
    keys.dash = true
    player.dashActivate()
  }
  if(e.code == binds.eat) {
    keys.eat = true
    player.eat()
  }
  //menu related stuff
  if(e.code == binds.restart) {
    if(globals.gameover) {
      init()
      return
    }
    if(!globals.restartWarning) {
      globals.restartWarning = true
    }
    else {
      init()
    }
  }
  if(e.code == binds.pause) {
    pause()
  }
  if(e.code == "ShiftLeft") {
    keys.shift = true
  }
  if(e.code == "ControlLeft") {
    keys.ctrl = true
  }
  if(e.code == binds.hitbox) {
    debug.drawHitboxes = !debug.drawHitboxes
  }
  if(e.code == binds.sprite) {
    debug.hideSprites = !debug.hideSprites
  }
  
  if(e.code == binds.viewControls) {
    toggleControls()
  }
  if(e.code == binds.returnToTitle) {
    if(!globals.quitWarning) {
      globals.quitWarning = true
    }
    else {
      toggleStartMenu()
      hideControls()
      hideTips()
      drawBackground()
    }
  }
})

document.addEventListener("keyup", function(e) {
  if(e.code == binds.left) {
    keys.left = false
  }
  if(e.code == binds.right) {
    keys.right = false
  }
  if(e.code == binds.up) {
    keys.up = false
  }
  if(e.code == binds.down) {
    keys.down = false
  }
  if(e.code == binds.quickfall) {
    keys.quickfall = false
  }
  if(e.code == binds.jump) {
    keys.jump = false
  }
  if(e.code == "ShiftLeft") {
    keys.shift = false
  }
  if(e.code == "ControlLeft") {
    keys.ctrl = false
  }
})
