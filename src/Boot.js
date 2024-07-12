import * as PIXI from 'pixi.js';
import GameMain from './GameMain';

const app = new PIXI.Application({
  resizeTo: window,
  resolution: window.devicePixelRatio,
  autoDensity: true
});
document.getElementById('gameContainer').appendChild(app.view);

const game = new GameMain(app);

// Handle window resize
window.addEventListener('resize', resize);

function resize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  // Adjust the slot machine elements accordingly
  GameMain.resize();
}

// Initial resize
resize();
