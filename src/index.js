document.addEventListener('DOMContentLoaded', () => {
  // Util
  function xor(a, b) {
    return (a || b) && !(a && b);
  }
  // game config
  let gameInitialized;
  let gameStarted;
  let gameOver;
  // keyboard
  const fps = 30;
  const keyCodes = {
    Right: 39,
    Left: 37,
    Up: 38,
    Down: 40,
    D: 68,
    A: 65,
    W: 87,
    S: 83,
  };
  let rightPressed;
  let leftPressed;
  let upPressed;
  let downPressed;
  function setKeyPressed(eventName, value) {
    document.addEventListener(eventName, (e) => {
      switch (e.keyCode) {
        case keyCodes.Right:
        case keyCodes.D:
          rightPressed = value;
          break;
        case keyCodes.Left:
        case keyCodes.A:
          leftPressed = value;
          break;
        case keyCodes.Up:
        case keyCodes.W:
          upPressed = value;
          break;
        case keyCodes.Down:
        case keyCodes.S:
          downPressed = value;
          break;
        default:
      }

      if (gameOver) {
        gameInitialized = false;
      } else {
        gameStarted = true;
      }
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
  canvasContext.lineWidth = 2;

  // Player Initialize
  let life;
  const lifeMax = 10;
  let score;
  let highScore = 0;
  const player = {};
  const square = 24;
  const playerAccesMax = 32;
  const enemies = [{}, {}, {}, {}];

  function gameInitialize() {
    gameStarted = false;
    gameOver = false;
    // Keybord
    rightPressed = false;
    leftPressed = false;
    upPressed = false;
    downPressed = false;

    // Player Initialize
    life = lifeMax;
    score = 0;
    player.X = canvasElem.width / 2;
    player.Y = canvasElem.height / 2;
    player.accelX = 0;
    player.accelY = 0;
    player.damaged = false;
    enemies[0].X = canvasElem.width / 5 * 4;
    enemies[0].Y = canvasElem.height / 5 * 4;
    enemies[0].accelMax = 4;
    enemies[1].X = canvasElem.width / 5 * 1;
    enemies[1].Y = canvasElem.height / 5 * 1;
    enemies[1].accelMax = 16;
    enemies[2].X = enemies[0].X;
    enemies[2].Y = enemies[1].Y;
    enemies[3].X = enemies[1].X;
    enemies[3].Y = enemies[0].Y;
    enemies.map((enemy) => {
      enemy.accelX = 0;
      enemy.accelY = 0;
      return enemy;
    });

    gameInitialized = true;
  }

  function updateActors() {
    // Player Update
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

    // Enemies Update
    const enemyAccelRate = (score < 200) ? 0.02 : 0.002 * score;
    [enemies[0], enemies[1]].forEach((enemy) => {
      enemy.accelX += (enemy.X < player.X ? 1 : -1) * enemyAccelRate;
      enemy.accelY += (enemy.Y < player.Y ? 1 : -1) * enemyAccelRate;
      enemy.accelX = Math.min(enemy.accelX, enemy.accelMax);
      enemy.accelY = Math.min(enemy.accelY, enemy.accelMax);
      enemy.X += enemy.accelX;
      enemy.Y += enemy.accelY;
    });
    enemies[2].X = enemies[0].X;
    enemies[2].Y = enemies[1].Y;
    enemies[3].X = enemies[1].X;
    enemies[3].Y = enemies[0].Y;
    if (player.damaged) {
      player.damaged = false;
    } else {
      enemies.forEach((enemy) => {
        if (Math.abs(enemy.X - player.X) < square / 2
        && Math.abs(enemy.Y - player.Y) < square / 2) {
          life -= 1;
          player.damaged = true;
        }
      });
    }

    // Score Update
    const expX1 = (enemies[0].X < player.X && player.X < enemies[1].X);
    const expX2 = (enemies[1].X < player.X && player.X < enemies[0].X);
    const expY1 = (enemies[0].Y < player.Y && player.Y < enemies[1].Y);
    const expY2 = (enemies[1].Y < player.Y && player.Y < enemies[0].Y);

    if (xor(expX1, expX2) && xor(expY1, expY2)) {
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

    // Render Player
    canvasContext.beginPath();
    canvasContext.strokeRect(player.X - square / 2, player.Y - square / 2, square, square);
    if (!player.damaged) {
      canvasContext.fillStyle = foregroundColor;
      canvasContext.fillRect(player.X - square / 2, player.Y - square / 2, square, square);
      canvasContext.fillStyle = backgroundColor;
    }
    // Render Enemies
    enemies.forEach((enemy) => {
      canvasContext.strokeRect(enemy.X - square / 2, enemy.Y - square / 2, square, square);
    });
    canvasContext.fillStyle = foregroundColor;
    canvasContext.fillText(`SCORE: ${score}`, 10, 30);
    canvasContext.fillText(`HP${life}`, player.X - square, player.Y - 20);
    canvasContext.rect(
      enemies[0].X, enemies[0].Y,
      enemies[1].X - enemies[0].X,
      enemies[1].Y - enemies[0].Y,
    );
    canvasContext.stroke();

    // Game Scene
    if (gameStarted) {
      updateActors();
    } else if (!gameOver) {
      canvasContext.fillText('Don\'t touch cornors of the square', 300, 60);
      canvasContext.fillText('Keep inside the square', 220, 320);
    }
    if (life <= 0) {
      life = 0;
      gameOver = true;
      gameStarted = false;
      highScore = Math.max(score, highScore);
      document.getElementById('highscore').innerText = highScore;
    }

    setTimeout(main, 1000 / fps);
  }

  // loop
  main();
});
