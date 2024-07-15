import { Container, Sprite, Text, Assets } from 'pixi.js';
import { gsap } from 'gsap';

class Button extends Container {
  constructor(label) {
    super();
    this.label = label;

    this.createButton();
  }

  createButton() {
    // Create button states
    this.normalState = new Sprite(Assets.get(`${this.label}-normal`));
    this.hoverState = new Sprite(Assets.get(`${this.label}-hover`));
    this.disabledState = new Sprite(Assets.get(`${this.label}-disabled`));

    // Set anchor to center
    this.normalState.anchor.set(0.5);
    this.hoverState.anchor.set(0.5);
    this.disabledState.anchor.set(0.5);

    // Add normal state by default
    this.addChild(this.normalState, this.hoverState, this.disabledState);

    // Interactivity
    this.eventMode = 'static';
    this.buttonMode = true;
    this.on('pointerdown', this.onButtonDown.bind(this));
    this.on('pointerup', this.onButtonUp.bind(this));
    this.on('pointerover', this.onButtonOver.bind(this));
    this.on('pointerout', this.onButtonOut.bind(this));

    // Set initial state
    this.state = 'normal';
    this.updateState();
  }

  setState(state) {
    this.state = state;
    this.updateState();
  }

  updateState() {
    this.normalState.visible = this.state === 'normal';
    this.hoverState.visible = this.state === 'hover';
    this.disabledState.visible = this.state === 'disabled';
  }

  onButtonDown() {
    if (this.state !== 'disabled') {
      gsap.to(this.scale, { duration: 0.1, x: 0.9, y: 0.9 });
    }
  }

  onButtonUp() {
    if (this.state !== 'disabled') {
      gsap.to(this.scale, { duration: 0.1, x: 1, y: 1 });
    }
  }

  onButtonOver() {
    if (this.state !== 'disabled') {
      this.setState('hover');
    }
  }

  onButtonOut() {
    if (this.state !== 'disabled') {
      this.setState('normal');
    }
  }

  disable() {
    this.setState('disabled');
    this.eventMode = 'none';
  }

  enable() {
    this.setState('normal');
    this.eventMode = 'static';
  }
}

export default Button;
