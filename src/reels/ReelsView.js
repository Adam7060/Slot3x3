import { Container, Sprite, Assets } from 'pixi.js';
import Reel from './Reel';
import { getCurrentOrientation, getScale } from '../utils';
import { SelectedResolution } from '../resolution-selector';
import Events from '../Events';

class ReelsView {
  constructor(config) {
    this.config = config;
    this.container = new Container();

    this.background = null; // Placeholder for the background sprite
    this.reels = [];
    this.reelsStoppedCount = 0;

    this.createEvents();
    this.create();
  }

  createEvents() {
    Events.on('spin', () => {
      this.startSpin();
    });
    Events.on('reelStopped', this.onReelStopped.bind(this));
  }

  create() {
    this.background = Sprite.from(Assets.get('reels-view-bg'));
    this.container.addChildAt(this.background, 0); // Add at index 0 to ensure it's behind other elements

    const reelCfg = this.config[getCurrentOrientation()].reels;

    for (let i = 0; i < 3; i++) {
      const reel = new Reel(this.config, i);
      reel.container.x = i * (reelCfg.reelWidth + reelCfg.spacing) + reelCfg.startingX;
      reel.container.y = reelCfg.startingY;
      this.reels.push(reel);
      this.container.addChild(reel.container);
    }
  }

  startSpin() {
    this.reels.forEach((reel, i) => {
      setTimeout(() => {
        reel.startSpin();
      }, 150 * i);
    });

    // stop spinning after 1 second
    setTimeout(() => {
      this.stopSpin();
    }, 1000); // Stop each reel with a delay
  }

  stopSpin() {
    this.reels.forEach((reel, i) => {
      setTimeout(() => {
        reel.stopSpin();
      }, 150 * i);
    });
  }

  onReelStopped() {
    this.reelsStoppedCount++;
    if (this.reelsStoppedCount === this.reels.length) {
      this.reelsStoppedCount = 0;
      this.checkResults();
      Events.emit('spinStopped');
    }
  }

  // this will just be something casual, no math model here (not requested in the task, but i will happily discuss it in a call). I'm going to issue a win whenever there are 5 symbols of one kind present on all reels.
  checkResults() {
    const symbolCounts = {};

    // Count the symbols
    this.reels.forEach(reel => {
      reel.symbols.forEach(symbol => {
        const symbolId = symbol.symbolId;
        if (!symbolCounts[symbolId]) {
          symbolCounts[symbolId] = 0;
        }
        symbolCounts[symbolId]++;
      });
    });

    // Check for win condition and play win animation
    Object.keys(symbolCounts).forEach(symbolId => {
      if (symbolCounts[symbolId] >= 5) {
        Events.emit('win', symbolId);
        this.reels.forEach(reel => {
          reel.symbols.forEach(symbol => {
            if (symbol.symbolId == symbolId) {
              symbol.startAnimation();
            }
          });
        });
      }
    });
  }

  resize(newWidth, newHeight) {
    this.container.x = (SelectedResolution.width - this.background.texture.width) / 2;
    this.container.y = this.config[getCurrentOrientation()].reelsView.posY;
  }
}

export default ReelsView;
