import { Container, Sprite, AnimatedSprite, Assets, Texture, Rectangle } from 'pixi.js';
import { getCurrentOrientation } from '../utils';

class Symbol {
  constructor(symbolId, config) {
    this.symbolId = symbolId;
    this.container = new Container();
    this.config = config;

    this.symbolImage = new Sprite(Assets.get("symbol-" + symbolId));
    this.container.addChild(this.symbolImage);

    this.createWinAnimation();
    this.createSpinAnimation();


  }

  createSpinAnimation() {
    // spin animation
    const spinFrameWidth = this.config[getCurrentOrientation()].symbols.spin.frame.width;
    const spinFrameHeight = this.config[getCurrentOrientation()].symbols.spin.frame.height;
    this.spinAnimation = new AnimatedSprite(this.createAnimationTextures("spritesheet-spin", spinFrameWidth, spinFrameHeight, this.config[getCurrentOrientation()].symbols.spin.frameCount));
    this.spinAnimation.width = spinFrameWidth;
    this.spinAnimation.height = spinFrameHeight;
    this.spinAnimation.animationSpeed = 0.2;
    this.spinAnimation.loop = true;
    this.spinAnimation.visible = false;
    this.container.addChild(this.spinAnimation);
  }

  createWinAnimation() {
    // win animation
    const winFrameWidth = this.config[getCurrentOrientation()].symbols.win.frame.width;
    const winFrameHeight = this.config[getCurrentOrientation()].symbols.win.frame.height;
    this.winAnimation = new AnimatedSprite(this.createAnimationTextures("spritesheet-" + this.symbolId, winFrameWidth, winFrameHeight, this.config[getCurrentOrientation()].symbols.win.frameCount));
    this.winAnimation.width = winFrameWidth;
    this.winAnimation.height = winFrameHeight;
    this.winAnimation.animationSpeed = 0.5;
    this.winAnimation.loop = false;
    this.winAnimation.visible = false;
    this.container.addChild(this.winAnimation);
  }

  createAnimationTextures(key, frameWidth, frameHeight, frameCount) {
    const baseTexture = Assets.get(key).baseTexture;
    const textures = [];
    const sheetWidth = baseTexture.width;
    const sheetHeight = baseTexture.height;
    const framesPerRow = Math.floor(sheetWidth / frameWidth);
    const framesPerColumn = Math.floor(sheetHeight / frameHeight);

    for (let i = 0; i < frameCount; i++) {
      const x = (i % framesPerRow) * frameWidth;
      const y = Math.floor(i / framesPerRow) * frameHeight;
      const rectangle = new Rectangle(x, y, frameWidth, frameHeight);
      const texture = new Texture(baseTexture, rectangle);
      textures.push(texture);
    }

    return textures;
  }

  startAnimation() {
    this.symbolImage.visible = false;
    this.winAnimation.visible = true;
    this.winAnimation.play();
    this.winAnimation.onComplete = () => {
      this.winAnimation.visible = false;
      this.symbolImage.visible = true;
    };
  }

  startSpin() {
    this.symbolImage.visible = false;
    this.winAnimation.visible = false;
    this.winAnimation.stop();
    this.spinAnimation.visible = true;
    this.spinAnimation.play();
    this.spinAnimation.onComplete = () => {
      this.spinAnimation.visible = false;
      this.symbolImage.visible = true;
    };
  }

  stop() {
    this.symbolImage.visible = true;
    this.winAnimation.visible = false;
    this.spinAnimation.visible = false;
    this.winAnimation.stop();
    this.spinAnimation.stop();
  }

  updateSymbol(symbolId) {
    this.symbolId = symbolId;
    this.symbolImage.texture = Assets.get("symbol-" + symbolId);
    this.container.removeChild(this.winAnimation);
    this.createWinAnimation();
  }
}

export default Symbol;
