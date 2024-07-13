import { Assets, Text, Container } from 'pixi.js';

class GamePreloader {
  constructor(app) {
    this.app = app;
    this.container = new Container();
    this.app.stage.addChild(this.container);

    this.loadingText = null; // Placeholder for the loading text object
    this.config = null; // Placeholder for the loaded config
    this.assetsFilePath = 'assets/configs/assetsConfig.json'; // Path to your JSON file containing asset paths
    this.configFilePath = 'assets/configs/viewConfig.json'; // Path to your JSON config file
  }

  async loadConfig() {
    try {
      const response = await fetch(this.configFilePath);
      this.config = await response.json();
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  async load(callback) {
    await this.loadConfig();
    this.setupLoadingText();

    try {
      const response = await fetch(this.assetsFilePath);
      const assetsData = await response.json();
      const totalAssets = assetsData.length;
      let loadedAssets = 0;

      for (const asset of assetsData) {
        await Assets.load(asset.path);
        loadedAssets++;
        this.updateProgress(loadedAssets / totalAssets);
      }
      console.log('All assets loaded');
      callback();
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }

  setupLoadingText() {
    const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    const config = this.config[orientation].loading;

    this.loadingText = new Text('Loading... 0%', {
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
      fill: config.color,
      align: 'center'
    });
    this.container.addChild(this.loadingText);
    this.updateTextPosition();
  }

  updateProgress(progress) {
    this.loadingText.text = `Loading... ${Math.round(progress * 100)}%`;
  }

  destroy() {
    this.app.stage.removeChild(this.container);
    this.container.destroy({ children: true });
  }

  updateTextPosition() {
    const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    const config = this.config[orientation].loading;

    this.loadingText.x = config.posX - this.loadingText.width / 2;
    this.loadingText.y = config.posY - this.loadingText.height / 2;
  }

  resize = () => {
    if (this.loadingText) {
      this.updateTextPosition();
    }
  };
}

export default GamePreloader;
