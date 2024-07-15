import Button from './Button';
import Events from '../Events';

class SpinButton extends Button {
  constructor(label) {
    super(label);

    this.createEvents();
  }

  createEvents() {
    Events.on('spinStopped', () => {
      this.enableButton();
    });
  }

  onButtonUp() {
    super.onButtonUp();
    if (this.state !== 'disabled') {
      Events.emit('spin'); // Emit custom event for spinning
      super.disable();
    }
  }

  enableButton() {
    super.enable();
  }
}

export default SpinButton;
