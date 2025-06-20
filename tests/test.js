import assert from 'assert';
import { ErrorHandler } from '../src/modules/ErrorHandler.js';
import { ModelLoader } from '../src/modules/ModelLoader.js';
import { checkWebGPUSupport } from '../src/modules/SupportUtils.js';

async function testErrorHandler() {
  const container = { textContent: '', classList: { remove() {} } };
  const handler = new ErrorHandler(container);
  handler.show('error');
  assert.strictEqual(container.textContent, 'error');
}

async function testCheckWebGPUSupport() {
  const container = { textContent: '', classList: { remove() {} } };
  const handler = new ErrorHandler(container);
  global.navigator = {}; // no gpu support
  const result = checkWebGPUSupport(handler);
  assert.strictEqual(result, false);
  assert.ok(container.textContent.includes('WebGPU is not supported'));
}

async function testModelLoaderFail() {
  global.fetch = async () => ({ ok: false, statusText: 'Not Found' });
  const loader = new ModelLoader();
  try {
    await loader.loadModel('missing.glb');
    assert.fail('Expected error');
  } catch (e) {
    assert.ok(e.message.includes('Not Found'));
  }
}

async function run() {
  await testErrorHandler();
  await testCheckWebGPUSupport();
  await testModelLoaderFail();
  console.log('Tests passed');
}

run();
