document.addEventListener('DOMContentLoaded', () => {
  // game config
  let gameInitialized;
  let gameStarted;
  let gameOver;
  // keyboard
  const fps = 30;
  const keyCodeRight = 39;
  const keyCodeLeft = 37;
  const keyCodeUp = 38;
  const keyCodeDown = 40;
  let rightPressed;
  let leftPressed;
  let upPressed;
  let downPressed;
  function setKeyPressed(eventName, value) {
    document.addEventListener(eventName, (e) => {
      switch (e.keyCode) {
        case keyCodeRight:
          rightPressed = value;
          break;
        case keyCodeLeft:
          leftPressed = value;
          break;
        case keyCodeUp:
          upPressed = value;
          break;
        case keyCodeDown:
          downPressed = value;
          break;
        default:
      }
      gameStarted = true;
      if (gameOver) { gameInitialized = false; }
    }, false);
  }
  setKeyPressed('keydown', true);
  setKeyPressed('keyup', false);
  // canvas initialize
  const canvasElem = document.getElementById('main-canvas');
  const canvasContext = canvasElem.getContext('2d');
  const backgroundColor = 'dimgray';
  const foregroundColor = 'whitesmoke';
  canvasContext.font = '18px serif';

  // Player Initialize
  let life;
  let score;
  const player = {};
  const playerSize = 20;
  const playerAccesMax = 20;
  const enemy = {};
  const enemyAccel = 4;

  function gameInitialize() {
    gameStarted = false;
    gameOver = false;
    // Keybord
    rightPressed = false;
    leftPressed = false;
    upPressed = false;
    downPressed = false;

    // Player Initialize
    life = 100;
    score = 0;
    player.X = canvasElem.width / 3;
    player.Y = canvasElem.height / 3;
    player.accelX = 0;
    player.accelY = 0;
    enemy.X = canvasElem.width / 3 * 2;
    enemy.Y = canvasElem.height / 3 * 2;

    gameInitialized = true;
  }

  function updateActors() {
    // Player
    function adjustPlayerCoordinate(xy, size) {
      let retXY = xy;
      if (xy > size) { retXY = 0; }
      if (xy < 0) { retXY = size; }
      return retXY;
    }
    player.X = adjustPlayerCoordinate(player.X, canvasElem.width);
    player.Y = adjustPlayerCoordinate(player.Y, canvasElem.height);
    if (rightPressed) { player.accelX += 1; } else if (leftPressed) { player.accelX -= 1; }
    if (downPressed) { player.accelY += 1; } else if (upPressed) { player.accelY -= 1; }
    player.accelX = Math.min(player.accelX, playerAccesMax);
    player.accelY = Math.min(player.accelY, playerAccesMax);
    player.X += player.accelX;
    player.Y += player.accelY;

    // Enemy
    enemy.X += enemyAccel * (enemy.X < player.X ? 1 : -1);
    enemy.Y += enemyAccel * (enemy.Y < player.Y ? 1 : -1);
    if (Math.abs(enemy.X - player.X) < playerSize && Math.abs(enemy.Y - player.Y) < playerSize) {
      life -= 1;
    } else {
      score += 1;
    }
  }

  // Rendering
  function main() {
    if (!gameInitialized) { gameInitialize(); }

    // canvas clear
    canvasContext.fillStyle = backgroundColor;
    canvasContext.strokeStyle = foregroundColor;
    canvasContext.clearRect(0, 0, canvasElem.width, canvasElem.height);
    canvasContext.fillRect(0, 0, canvasElem.width, canvasElem.height);

    // Render
    canvasContext.beginPath();
    canvasContext.strokeRect(player.X - playerSize / 2, player.Y - playerSize / 2, playerSize, playerSize);
    canvasContext.beginPath();
    canvasContext.strokeRect(enemy.X - playerSize / 2, enemy.Y - playerSize / 2, playerSize, playerSize);
    canvasContext.fillStyle = foregroundColor;
    canvasContext.fillText(`SCORE: ${score}`, 10, 30);
    canvasContext.fillText(life, player.X - playerSize, player.Y - 20);

    if (gameStarted) { updateActors(); }
    if (life <= 0) {
      life = 0;
      gameOver = true;
      gameStarted = false;
    }

    setTimeout(main, 1000 / fps);
  }

  // loop
  main();
});
