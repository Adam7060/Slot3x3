import { Container, Sprite, Texture } from 'pixi.js';
import Symbol from './Symbol';
import Events from '../Events';
import { getCurrentOrientation } from '../utils';

class Reel {
  constructor(config, index) {
    this.container = new Container();
    this.symbols = [];
    this.symbolKeys = ["A", "J", "K"];
    this.config = config;
    this.index = index;
    this.isSpinning = false;

    // Fill the reel with random symbols
    this.createSymbols();
    this.randomizeSymbols();
  }

  createSymbols() {
    for (let i = 0; i < 3; i++) {
      const symbolId = this.symbolKeys[Math.floor(Math.random() * this.symbolKeys.length)];
      const symbol = new Symbol(symbolId, this.config);
      symbol.container.y = i * this.config[getCurrentOrientation()].symbols.width;
      this.symbols.push(symbol);
      this.container.addChild(symbol.container);
    }
  }

  startSpin() {
    this.isSpinning = true;
    this.symbols.forEach(symbol => {
      symbol.startSpin();
    });
  }

  stopSpin() {
    if (this.isSpinning) {
      this.isSpinning = false;
      this.symbols.forEach(symbol => {
        symbol.stop();
      });
      this.randomizeSymbols();
      Events.emit('reelStopped');
    }

  }

  randomizeSymbols() {
    this.symbols.forEach(symbol => {
      const randomKey = this.symbolKeys[Math.floor(Math.random() * this.symbolKeys.length)];
      symbol.updateSymbol(randomKey);
    });
  }
}

export default Reel;
