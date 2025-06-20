export function checkWebGPUSupport(errorHandler) {
  if (typeof navigator === 'undefined' || !navigator.gpu) {
    errorHandler.show(
      'WebGPU is not supported in this browser. Please use a compatible browser or enable the WebGPU flag.'
    );
    return false;
  }
  return true;
}
