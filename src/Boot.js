import { Application } from 'pixi.js';
import GameMain from './scenes/GameMain';
import GamePreloader from './scenes/GamePreloader';

// Initialize the PIXI application
const app = new Application({
  resizeTo: window,
  autoDensity: true,
  backgroundColor: 0x7c4700 // White background
});
document.getElementById('gameContainer').appendChild(app.view);

let preloader, game;

function bootGame() {
  // Initialize the preloader and start loading assets
  preloader = new GamePreloader(app);
  preloader.load((config) => {
    // Assets loaded, start the game
    game = new GameMain(app, config);
    game.create();
    // Cleanup preloader after starting the game
    preloader.destroy();
    preloader = null; // Clear the preloader from memory
  });
}

function resize() {
  let newWidth = window.innerWidth;
  let newHeight = window.innerHeight;
  if (preloader) {
    preloader.resize(newWidth, newHeight);
  }
  if (game) {
    game.resize(newWidth, newHeight);
  }
}

// Add a single resize event listener for all the app
window.addEventListener('resize', resize);

// Start the boot process
bootGame();
