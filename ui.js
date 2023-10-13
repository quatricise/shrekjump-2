function updateHeartsVisual() {
  for (let i = 1; i <= player.lifeMax; i++) {
    if(i <= player.life) ctx.drawImage(UI.images.heart.regular, 20 + UI.iconOffset.value, 20, 32, 32)
    else ctx.drawImage(UI.images.heart.empty, 20 + UI.iconOffset.value, 20, 32, 32)
    UI.iconOffset.increment()
  }
}

function updateOnionVisual() {
  if(player.onions <= 0) return
  ctx.drawImage(UI.images.onion.default, 20 + UI.iconOffset.value, 20, 32, 32)
  UI.iconOffset.increment()
  
}

function updateOnionMeter() {
  if(!player.mods.onion) return
  ctx.drawImage(UI.images.onion.default, 20, 70, 24, 24)

  let padding = data.overlays.onion_meter.padding,
    offset = data.overlays.onion_meter.offset,
    size = data.overlays.onion_meter.size,
    minWidth = data.overlays.onion_meter.minWidth
  ctx.save()
  ctx.translate(offset.x, offset.y)
  //outline
  ctx.fillStyle = colors.onion_outline
  ctx.fillRect(0, 0, minWidth + size.x * player.timers.onion/data.onion.duration, size.y)
  //fill
  ctx.fillStyle = colors.onion
  ctx.fillRect(0 + padding, 0 + padding, minWidth + size.x * player.timers.onion/data.onion.duration - padding*2, size.y - padding*2)
  ctx.restore()

  UI.iconOffset.increment()
}

function updateUI() {
  UI.iconOffset.value = 0
  updateHeartsVisual() 
  updateOnionVisual()
  updateOnionMeter()
  if(globals.restartWarning) {
    ctx.font = "28px Arial"
    ctx.fillStyle = "black"
    ctx.fillText("Press [R] again to restart.", 75, 100)
  }
  if(globals.quitWarning) {
    ctx.font = "28px Arial"
    ctx.fillStyle = "black"
    ctx.fillText(`Press [${binds.returnToTitle}] again to quit.`, 75, 150)
  }
}

const UI = {
  images: {
    heart: {
      regular: new Image(),
      empty: new Image(),
    },
    onion: {
      default: new Image(),
    },
    
  },
  iconOffset: {
    value: 0,
    increment() {
      this.value += 32
    }
  },
}

UI.images.heart.regular.src = images.heart.regular
UI.images.heart.empty.src = images.heart.empty
UI.images.onion.default.src = images.onion.icon

function generateControls() {
  let ctrls = Q('.controls')
  let labels = Object.keys(binds)

  let descriptions = [
    "Left",
    "Right",
    "Up",
    "Down",
    "Quickfall",
    "Jump",
    "Dash",
    "Hitbox",
    "Sprite",
    "Eat onion",
    "Restart",
    "Pause",
    "View controls",
    "Return to title",
  ]
  let keynames = [
    "Left",
    "Right",
    "Up",
    "Down",
    "Down",
    "Spacebar",
    "Left shift",
    "E",
    "Sprite",
    "E",
    "R",
    "P",
    "C",
    "Escape",
  ]

  for (let i = 0; i < labels.length; i++) {
    if(labels[i] === "hitbox" || labels[i] === "sprite") continue
    let row = El('div')
    let label = El("div")
    let value = El("div")

    label.innerText = descriptions[i]
    value.innerText = keynames[i]
    value.style.cursor = "pointer"
    value.title = "Change"

    value.onclick = () => {
      rebind.active = true
      rebind.bind = value.parentElement.querySelector(".control-label").innerText
      rebind.visual_label = value
      value.dataset.text = value.innerText
      value.innerText = "Press a key..."
    }

    row.classList.add("control-row")
    label.classList.add("control-label")
    value.classList.add("control-value")

    row.append(label)
    row.append(value)
    ctrls.append(row)
  }
}

generateControls()

function toggleControls() {
  if(!globals.paused && globals.started) pause()
  let ctrls = Q('.controls-container')
  ctrls.classList.toggle("hidden")
  if(ctrls.classList.contains("hidden") && Q("#start-menu").classList.contains("hidden") && globals.started) pause()
}

function toggleTips() {
  if(!globals.paused && globals.started) pause()
  let tips = Q('.tips-container')
  tips.classList.toggle("hidden")
  if(tips.classList.contains("hidden") && Q("#start-menu").classList.contains("hidden") && globals.started) pause()
}
function hideControls() {
  let ctrls = Q('.controls-container')
  ctrls.classList.add("hidden")
}

function hideTips() {
  let tips = Q('.tips-container')
  tips.classList.add("hidden")
}

function toggleStartMenu() {
  if(!globals.started) return
  if(!globals.paused) pause()
  let menu = Q("#start-menu")
  menu.classList.toggle("hidden")
  if(menu.classList.contains("hidden") && globals.started) pause()
  console.log('toggle start menu')
}

