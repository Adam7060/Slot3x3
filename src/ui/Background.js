import { Sprite, Container, Assets } from 'pixi.js';
import { SelectedResolution } from '../resolution-selector';

class Background {
  constructor() {
    this.container = new Container();
    this.background = null;
    this.create();
  }

  create() {
    this.background = Sprite.from(Assets.get('background'));
    this.container.addChild(this.background);
    this.background.position.set(0, 0);
  }

  resize(newWidth, newHeight) {
    if (this.background) {
      // Calculate the scale to cover the entire canvas
      let scaleX = newWidth / this.background.texture.width;
      let scaleY = newHeight / this.background.texture.height;
      let scale = Math.max(scaleX, scaleY);

      // Set the scale and reposition the sprite to cover the whole canvas
      this.background.scale.set(scale);
      this.background.position.set(
        (newWidth - this.background.width) / 2,
        (newHeight - this.background.height) / 2
      );
    }
  }
}

export default Background;
