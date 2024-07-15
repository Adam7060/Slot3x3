import { Container, Graphics } from 'pixi.js';
import { getCurrentOrientation, getScale } from '../utils';
import { SelectedResolution } from '../resolution-selector';
import ReelsView from '../reels/ReelsView';
import Background from '../ui/Background';
import SpinButton from '../ui/SpinButton';

class GameMain {
  constructor(app, config) {
    this.app = app;
    this.config = config;
    this.rootContainer = new Container();
    this.rootContainer.pivot.set(SelectedResolution.width / 2, SelectedResolution.height / 2);
    this.app.stage.addChild(this.rootContainer);

    this.background = null;
    this.reelsView = null;
    this.spinButton = null;
  }

  create() {

    // Create the background and add it outside rootcontainer as it will have its own resize properties.
    this.background = new Background();
    this.app.stage.addChildAt(this.background.container, 0);

    // Create the ReelsView instance
    this.reelsView = new ReelsView(this.config);
    this.rootContainer.addChild(this.reelsView.container);

    this.spinButton = new SpinButton('spin-button');
    this.rootContainer.addChild(this.spinButton);

    // debugging
    // this.border = new Graphics();
    // this.rootContainer.addChild(this.border);
    // this.drawBorder(); // debugging

    // Call resize to adjust the initial size
    this.resize(window.innerWidth, window.innerHeight);
  }

  resize(newWidth, newHeight) {
    this.app.renderer.resize(newWidth, newHeight);

    let newScale;
    if (getCurrentOrientation() == "portrait") {
      newScale = getScale(SelectedResolution.height, SelectedResolution.width, newWidth, newHeight);
    } else {
      newScale = getScale(SelectedResolution.width, SelectedResolution.height, newWidth, newHeight);
    }

    this.rootContainer.scale.set(newScale);
    this.rootContainer.position.set(newWidth / 2, newHeight / 2);

    this.spinButton.position.set(this.config[getCurrentOrientation()].spinButton.posX, this.config[getCurrentOrientation()].spinButton.posY);

    this.background.resize(newWidth, newHeight);
    this.reelsView.resize(newWidth, newHeight);

    // this.drawBorder(); // debugging
  }

  // debugging 
  // drawBorder() {
  //   this.border.clear();
  //   this.border.lineStyle(25, 0xff0000); // Red color with 5px thickness

  //   if (getCurrentOrientation() == "portrait") {
  //     this.border.drawRect(this.rootContainer.pivot.x - SelectedResolution.height / 2, this.rootContainer.pivot.y - SelectedResolution.width / 2, SelectedResolution.height, SelectedResolution.width);
  //   } else {
  //     this.border.drawRect(this.rootContainer.pivot.x - SelectedResolution.width / 2, this.rootContainer.pivot.y - SelectedResolution.height / 2, SelectedResolution.width, SelectedResolution.height);
  //   }
  // }
}

export default GameMain;
