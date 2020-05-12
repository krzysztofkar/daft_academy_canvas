import { SLIDES_COUNT, lerp, getRndInteger } from "./utils.js";

const colorArray = [
  [171, 4, 242],
  [124, 7, 242],
  [81, 7, 242],
  [34, 216, 183],
  [214, 242, 4]
]

const slideArray = [
  [
    [200, 200, 800, colorArray[0]],
    [900, 900, 800, colorArray[1]],
    [1600, 400, 800, colorArray[2]]
  ],
  [
    [200, 800, 800, colorArray[1]],
    [900, 300, 800, colorArray[2]],
    [1600, 200, 800, colorArray[3]]
  ],
  [
    [200, 200, 800, colorArray[2]],
    [900, 300, 800, colorArray[3]],
    [1600, 400, 800, colorArray[4]]
  ]
]

let currentAlpha = 0
let previousAlpha = 0
let currentSlide = 0

const canvas = document.getElementById('canvas')
const title = document.getElementById('title')

const ctx = canvas.getContext('2d')

const drawGradient = ({ x, y }, radius, color) => {
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
  grad.addColorStop(0, color)
  grad.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = grad
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2)
}

const drawBackground = (index, alpha = 1) => {
  index < 0 && (index = SLIDES_COUNT)

  const currentBg = slideArray[index]
  currentBg.forEach(([x, y, radius, colors]) => {
    const [r, g, b] = colors
    drawGradient({ x, y }, radius, `rgba(${r},${g},${b},${alpha})`)
  })
}

const drawTitleBackground = () => {
  canvas.toBlob(function (blob) {
    const url = URL.createObjectURL(blob);
    title.style.backgroundImage = `url(${url})`
  }, "image/jpeg", 0.1);
  let req = requestAnimationFrame(() => drawTitleBackground(ctx, canvas))
  if (currentAlpha > 0.9) {
    cancelAnimationFrame(req);
  }

}


const draw = () => {
  canvas.setAttribute('width', window.innerWidth)
  canvas.setAttribute('height', window.innerHeight)

  previousAlpha = lerp(previousAlpha, 0)
  currentAlpha = lerp(currentAlpha, 1)

  drawBackground(currentSlide - 1, previousAlpha)
  drawBackground(currentSlide, currentAlpha)
  const req = requestAnimationFrame(() => draw(ctx, canvas))

  if (currentAlpha > 0.9) {
    cancelAnimationFrame(req);
  }
}

draw();
drawTitleBackground();

export const handleCanvasAnimation = slideIndex => {
  currentSlide = slideIndex
  requestAnimationFrame(() => drawTitleBackground(ctx, canvas))
  requestAnimationFrame(() => draw(ctx, canvas))


  currentAlpha = 0
  previousAlpha = 1
}
