import { Assets, Text, Container } from 'pixi.js';
import { SelectedResolution } from '../resolution-selector';
import { getCurrentOrientation } from '../utils';

class GamePreloader {
  constructor(app) {
    this.app = app;
    this.container = new Container();
    this.app.stage.addChild(this.container);

    this.loadingText = null; // Placeholder for the loading text object
    this.config = null; // Placeholder for the loaded config
    this.assetsFilePath = 'assets/configs/assetsConfig.json'; // Path to JSON file containing asset paths
    this.configFilePath = 'assets/configs/viewConfig.json'; // Path to JSON config file
  }

  async loadConfig() {
    try {
      const response = await fetch(this.configFilePath);
      this.config = await response.json();
      this.updateConfigValues(this.config);
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  // so inside viewConfig we treat the game as if it's always 1920x1080 and add display values accordingly, then this function will translate
  // these values automatically for selected resolution.
  updateConfigValues(config) {
    Object.keys(config).forEach((key) => {
      if (typeof config[key] == "object") {
        this.updateConfigValues(config[key]);
      } else if (typeof config[key] == "number") {
        const exceptions = ["frameCount"]; // here you can add exception keys with type number
        if (exceptions.indexOf(key) == -1) {
          config[key] *= SelectedResolution.height / 1080;
          config[key] = Math.round(config[key]);
        }
      }
    });
  }

  async loadAssetsConfig() {
    try {
      const response = await fetch(this.assetsFilePath);
      return await response.json();
    } catch (error) {
      console.error('Error loading assets config:', error);
      return [];
    }
  }

  async load(callback) {
    await this.loadConfig();
    this.setupLoadingText();

    const assetsData = await this.loadAssetsConfig();
    const totalAssets = assetsData.length;
    let loadedAssets = 0;

    try {
      for (const asset of assetsData) {
        await Assets.add(asset.key, `assets/${SelectedResolution.path}/${asset.path}`); // Register the asset with its key
        await Assets.load(asset.key); // Load the asset using its key
        loadedAssets++;
        this.updateProgress(loadedAssets / totalAssets);
      }
      console.log('All assets loaded');
      callback(this.config); // Notify when all assets are loaded
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }

  setupLoadingText() {
    const config = this.config[getCurrentOrientation()].loading;

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
    const config = this.config[getCurrentOrientation()].loading;

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
