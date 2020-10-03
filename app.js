/* PLAN

DONE Snake movement should increase when snake eats 10 of the foods
  (check snake length: 14, 24, 34, etc...)
DONE The food should not appear on the snake
DONE If snake runs into his body game is over
DONE If snake hits a wall game is over

*/

const canvas = document.querySelector("canvas"),
  ctx = canvas.getContext("2d")

canvas.width = canvas.height = 600
canvas.style.width = "600px"
canvas.style.height = "600px"
canvas.style.border = "1px solid black"
canvas.style.display = "block"
canvas.style.margin = "auto"

const CELL_SIZE = 30,
  WORLD_WIDTH = Math.floor(canvas.width / CELL_SIZE),
  WORLD_HEIGHT = Math.floor(canvas.height / CELL_SIZE)

let input,
  snake,
  food,
  gameOver,
  score,
  moveInterval


function reset() {
  input = {}
  snake = {
    moveElapsed: 0,
    length: 4,
    parts: [{ x: 0, y: 0 }],
    dir: null,
    newDir: { x: 1, y: 0 }
  }
  food = {
    x: Math.floor(Math.random() * WORLD_WIDTH),
    y: Math.floor(Math.random() * WORLD_HEIGHT)
  }
  moveInterval = 400
  speed = "1.00"
  gameOver = false
  score = 0
}

function generateFood() {
  let newFood = {
    x: Math.floor(Math.random() * WORLD_WIDTH),
    y: Math.floor(Math.random() * WORLD_HEIGHT)
  }
  while (snake.parts.some((part, index) => index !== 0 && newFood.x === part.x && newFood.y === part.y)) {
    newFood = {
      x: Math.floor(Math.random() * WORLD_WIDTH),
      y: Math.floor(Math.random() * WORLD_HEIGHT)
    }
  }
  food = newFood
}

function update(delta) {
  if (gameOver) {
    if (input[" "]) reset()
    return
  }

  if (input.ArrowLeft && snake.dir.x !== 1) {
    snake.newDir = { x: -1, y: 0 }
  }
  else if (input.ArrowUp && snake.dir.y !== 1) {
    snake.newDir = { x: 0, y: -1 }
  }
  else if (input.ArrowRight && snake.dir.x !== -1) {
    snake.newDir = { x: 1, y: 0 }
  }
  else if (input.ArrowDown && snake.dir.y !== -1) {
    snake.newDir = { x: 0, y: 1 }
  }

  snake.moveElapsed += delta
  if (snake.moveElapsed > moveInterval) {
    snake.dir = snake.newDir
    snake.moveElapsed -= moveInterval
    const newSnakePart = {
      x: snake.parts[0].x + snake.dir.x,
      y: snake.parts[0].y + snake.dir.y
    }
    snake.parts.unshift(newSnakePart)

    if (snake.parts.length > snake.length) {
      snake.parts.pop()
    }
  }

  const head = snake.parts[0]

  if (head.x === food.x && head.y === food.y) {
    snake.length++
    score += 10

    generateFood()
  }

  if (score >= 1000) {
    moveInterval = 200
    speed = "2.00"

  }
  else if (score >= 900) {
    moveInterval = 220
    speed = "1.82"

  }
  else if (score >= 800) {
    moveInterval = 240
    speed = "1.67"

  }
  else if (score >= 700) {
    moveInterval = 260
    speed = "1.54"

  }
  else if (score >= 600) {
    moveInterval = 280
    speed = "1.43"

  }
  else if (score >= 500) {
    moveInterval = 300
    speed = "1.33"

  }
  else if (score >= 400) {
    moveInterval = 320
    speed = "1.25"

  }
  else if (score >= 300) {
    moveInterval = 340
    speed = "1.18"

  }
  else if (score >= 200) {
    moveInterval = 360
    speed = "1.11"

  }
  else if (score >= 100) {
    moveInterval = 380
    speed = "1.05"

  }

  const worldEdgeIntersect = head.x < 0 || head.y < 0 || head.x >= WORLD_WIDTH || head.y >= WORLD_HEIGHT

  const snakePartIntersect = snake.parts.some((part, index) => index !== 0 && head.x === part.x && head.y === part.y)

  if (worldEdgeIntersect || snakePartIntersect) {
    gameOver = true
  }

}

function render() {
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "black"
  snake.parts.forEach(({ x, y }, index) => {
    if (index === 0) ctx.fillStyle = "black"
    else ctx.fillStyle = "#3d3d3d"
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
  })

  ctx.fillStyle = "orange"
  ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

  ctx.fillStyle = "green"
  ctx.font = "20px Arial"
  ctx.fillText(`Score: ${score}`, canvas.width / 2, CELL_SIZE / 2)

  ctx.fillStyle = "skyblue"
  ctx.font = "20px Arial"
  ctx.fillText(`Speed: x${speed}`, canvas.width - 70, CELL_SIZE / 2)

  if (gameOver) {
    ctx.fillStyle = "red"
    ctx.font = "60px Arial"
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2)
    ctx.font = "20px Arial"
    ctx.fillText("Press SPACE to start over!", canvas.width / 2, canvas.height / 2 + 40)

  }
}

let lastLoopTime = Date.now()

function gameLoop() {
  const now = Date.now()
  const delta = now - lastLoopTime
  lastLoopTime = now

  update(delta)
  render()

  window.webkitRequestAnimationFrame(gameLoop)
}

reset()
gameLoop()

window.addEventListener('keydown', (event) => {
  input[event.key] = true
})

window.addEventListener('keyup', (event) => {
  input[event.key] = false
})