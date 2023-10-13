let content_sources = [
  "assets/content/content_1.webp",
  "assets/content/content_2.jpg",
  "assets/content/content_3.jpg",
  "assets/content/content_4.jpg",
  "assets/content/content_5.webp",
  "assets/content/content_6.jfif",
  "assets/content/content_7.png",
  "assets/content/content_8.png", 
]
let cross_sources = [
  "assets/content/cross_1.png",
  "assets/content/cross_2.png",
]

let slogans = [
  "Get yours now quickly!",
  "You won't believe its FX!",
  "Limited offer",
  "Discover your inner Shrek...↓",
  "Miracle product ☆☆☆☆☆",
  "Miracle product ☆☆☆☆",
  "Miracle product ☆",
  "I use it for all my problems. -\xa0Miranda",
  "Prepare your body for revolution!",
  "Get real with Shrek!",
  "It's a BOP!",
]
let slogans_2 = [
  "It looks good on you...",
  "Because you care",
  "For the perfect moment...",
  "Only 69 left in stock!",
  "Guaranteed to impress your friends",
  "It changed my life. -\xa0John",
]

let content_colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "black",
]

let content_bg_colors = [
  "white",
  "whitesmoke",
  "beige",
  "bisque",
]

let text_animations = [
    [
      { filter: 'hue-rotate(0deg)' },
      { filter: 'hue-rotate(360deg)' },
    ],
    [
      { color: 'blue' },
      { color: 'green' },
      { color: 'beige' },
      { color: 'salmon' },
    ],
    [
      { filter: 'hue-rotate(0deg)' },
      { filter: 'hue-rotate(360deg)' },
    ],
    [
      { backgroundColor: 'black' },
      { backgroundColor: 'blue' },
      { backgroundColor: 'orange' },

    ],
]

let text_animations_timings = [
  {
    duration: 1500,
    iterations: Infinity,
  },
  {
    duration: 600,
    iterations: 5,
  },
]

let content_links = [
  "https://www.cancer.net/cancer-types/testicular-cancer/symptoms-and-signs",
  "https://www.northshorecare.com/adult-diapers",
  "https://www.healthline.com/health/am-i-gay",
  "https://www.grindr.com",
  "https://boards.4chan.org/e/",
  "https://www.redtube.com/?search=sexy+mums",
  "https://www.crouton.net",
]

let content_fonts = [
  "Arial",
  "sans-serif",
  "monospace"
]

let content_transforms = [
  "translate(0px,10px) scale(1.1)",
  "translate(0px,-10px) rotate(15deg)",
  "rotate(-15deg)",
  "rotate(30deg)",
  "rotate(5deg) scale(1.25)",
]

let content_width = 250

let content = []

function displayContent() {
  if(randR(0,100) < 80) return;
  while(content.length > 3) {
    removeContent()
  }

  let container = El('div')
  let slogan = El('div')
  let slogan2 = El('div')
  let img = new Image(); img.src = content_sources[randR(0, content_sources.length - 1)]
  let cross = new Image(); cross.src = cross_sources[randR(0, cross_sources.length - 1)]
  let pos = randomizeContentPosition()

  container.style.position = "absolute"
  container.style.left = pos.x + "px"
  container.style.top =  pos.y + "px"
  container.style.transition = "all 0.1s ease-in-out"
  container.onmouseenter = () => {
    container.style.transform = content_transforms[randR(0, content_transforms.length - 1)]
    if(randR(0,100) > 80) {
      let pos = randomizeContentPosition()
      container.style.left = pos.x + "px"
      container.style.top =  pos.y + "px"
    }
  }
  container.onmouseleave = () => {
    container.style.transform = ""
  }

  slogan.innerText = slogans[randR(0, slogans.length - 1)]

  slogan.style.fontSize = randR(14, 28) + "px"
  slogan.style.backgroundColor = content_bg_colors[randR(0, content_bg_colors.length - 1)]
  slogan.style.cColor = content_colors[randR(0, content_colors.length - 1)]
  slogan.style.padding = "8px"
  slogan.style.maxWidth = content_width + "px"
  slogan.style.fontFamily = content_fonts[randR(0, content_fonts.length - 1)]

  slogan.animate(
    text_animations[randR(0, text_animations.length - 1)],
    text_animations_timings[randR(0, text_animations_timings.length - 1)]
  )
  
  slogan2.innerText = slogans_2[randR(0, slogans_2.length - 1)]

  slogan2.style.fontSize = randR(14, 28) + "px"
  slogan2.style.backgroundColor = content_bg_colors[randR(0, content_bg_colors.length - 1)]
  slogan2.style.color = content_colors[randR(0, content_colors.length - 1)]
  slogan2.style.padding = "8px"
  slogan2.style.maxWidth = content_width + "px"
  slogan2.style.fontFamily = content_fonts[randR(0, content_fonts.length - 1)]

  slogan.animate(
    text_animations[randR(0, text_animations.length - 1)],
    text_animations_timings[randR(0, text_animations_timings.length - 1)]
  )

  img.style.width = content_width + "px"
  img.style.height = "auto"
  img.style.margin = "0"
  img.style.cursor = "pointer"
  img.onclick = () => {
    window.open(content_links[randR(0, content_links.length - 1)])
    img.parentElement.remove()
  }

  cross.style.position = "absolute"
  cross.style.width = 20 + "px"
  cross.style.height = 20 + "px"
  cross.style.top = 5 + "px"
  cross.style.right = 5 + "px"
  // cross.style.zIndex = 2
  cross.style.cursor = "pointer"
  cross.onmousedown = () => {
    cross.parentElement.remove()
    content = content.filter(cont=> cont != cross.parentElement)
  }
  cross.onmouseenter = () => {
    cross.style.transform = "scale(1.2)"
    setTimeout(function() {
      let pos = randomizeContentPosition()
      cross.parentElement.style.left = pos.x + "px"
      cross.parentElement.style.top = pos.y + "px"
    }, 80)
  }
  cross.onmouseleave = () => {
    cross.style.transform = "scale(1.0)"
  }

  container.append(slogan)
  container.append(img)
  if(randR(0, 100) < 50) container.append(slogan2)
  container.append(cross)
  document.body.append(container)
  content.push(container)
}

function removeContent() {
  if(content.length < 1) return
  content[0].remove()
  content.shift()
}

function randomizeContentPosition() {
  let position_acceptable = false
  let pos;
  while(position_acceptable !== true) {
    pos = {
      x: randR(20, window.innerWidth - 400),
      y: randR(20, window.innerHeight - 400),
    }
    if(pos.x > window.innerWidth/2 - cw/2 - content_width && pos.x < window.innerWidth/2 + cw/2) continue
      position_acceptable = true
  }
  return pos
}

let ad_timer = 15000
let content_removal_period = 20000
let content_removal_id = setInterval(()=> {removeContent()}, content_removal_period)

setInterval(()=> {
  displayContent()
  clearTimeout(content_removal_id)
  content_removal_id = setInterval(()=> {removeContent()}, content_removal_period)
}, ad_timer)