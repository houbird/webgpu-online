import { ModelLoader } from './modules/ModelLoader.js';
import { Renderer } from './modules/Renderer.js';
import { UIController } from './modules/UIController.js';
import { ErrorHandler } from './modules/ErrorHandler.js';
import { checkWebGPUSupport } from './modules/SupportUtils.js';

const canvasContainer = document.getElementById('canvas-container');
const errorHandler = new ErrorHandler(document.getElementById('error-message'));

async function init() {
  if (!canvasContainer) {
    errorHandler.show('Canvas container element is missing.');
    return;
  }

  if (!checkWebGPUSupport(errorHandler)) {
    return;
  }

  const renderer = new Renderer(canvasContainer);
  const loader = new ModelLoader();
  const ui = new UIController(renderer);

  try {
    await loader.loadModel('../models/water-bottle.glb');
  } catch (err) {
    errorHandler.show(err.message);
    return;
  }

  renderer.setModel(loader.model);
  ui.init();
  renderer.start();
}

init();
