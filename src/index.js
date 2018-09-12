document.addEventListener('DOMContentLoaded', () => {
  // config
  const fps = 30;

  // Keybord
  const keyCodeRight = 39;
  const keyCodeLeft = 37;
  const keyCodeUp = 38;
  const keyCodeDown = 40;
  let rightPressed = false;
  let leftPressed = false;
  let upPressed = false;
  let downPressed = false;
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
    }, false);
  }
  setKeyPressed('keydown', true);
  setKeyPressed('keyup', false);

  // canvas initialize
  const canvasElem = document.getElementById('main-canvas');
  const canvasContext = canvasElem.getContext('2d');
  canvasContext.fillStyle = 'dimgray';
  canvasContext.strokeStyle = 'whitesmoke';

  // Player Initialize
  let playerX = 0;
  let playerY = 0;
  let playerAccelX = 0;
  let playerAccelY = 0;
  const playerSize = 20;

  // Rendering
  function render() {
    // canvas clear
    canvasContext.clearRect(0, 0, canvasElem.width, canvasElem.height);
    canvasContext.fillRect(0, 0, canvasElem.width, canvasElem.height);

    // render
    canvasContext.beginPath();
    canvasContext.strokeRect(playerX, playerY, playerSize, playerSize);

    // player
    function adjustPlayerCoordinate(xy, size) {
      let retXY = xy;
      if (xy > size + playerSize) { retXY = 0 - playerSize / 2; }
      if (xy < 0 - playerSize) { retXY = size + playerSize / 2; }
      return retXY;
    }
    playerX = adjustPlayerCoordinate(playerX, canvasElem.width);
    playerY = adjustPlayerCoordinate(playerY, canvasElem.width);
    if (rightPressed) { playerAccelX += 1; } else if (leftPressed) { playerAccelX -= 1; }
    if (downPressed) { playerAccelY += 1; } else if (upPressed) { playerAccelY -= 1; }
    playerX += playerAccelX;
    playerY += playerAccelY;
  }
  // loop
  setInterval(render, 1000 / fps);
});
