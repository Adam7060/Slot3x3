import { Application } from 'pixi.js';
import GameMain from './GameMain';
import GamePreloader from './GamePreloader';

// Initialize the PIXI application
const app = new Application({
  resizeTo: window,
  resolution: window.devicePixelRatio,
  autoDensity: true,
  backgroundColor: 0x7c4700 // White background
});
document.getElementById('gameContainer').appendChild(app.view);

let preloader, game;

function bootGame() {
  // Initialize the preloader and start loading assets
  preloader = new GamePreloader(app);
  preloader.load(() => {
    // Assets loaded, start the game
    game = new GameMain(app);
    game.start();
    // Cleanup preloader after starting the game
    preloader.destroy();
    preloader = null; // Clear the preloader from memory
  });
}

function resize() {
  if (preloader) {
    preloader.resize();
  }
  if (game) {
    game.resize();
  }
}

// Add a single resize event listener
window.addEventListener('resize', resize);

// Start the boot process
bootGame();
