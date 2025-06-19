import { ModelLoader } from './modules/ModelLoader.js';
import { Renderer } from './modules/Renderer.js';
import { UIController } from './modules/UIController.js';

const canvasContainer = document.getElementById('canvas-container');
const renderer = new Renderer(canvasContainer);
const loader = new ModelLoader();
const ui = new UIController(renderer);

async function init() {
  await loader.loadModel('../models/water-bottle.glb');
  renderer.setModel(loader.model);
  ui.init();
  renderer.start();
}

init();
