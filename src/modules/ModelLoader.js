export class ModelLoader {
  constructor() {
    this.model = null;
  }

  async loadModel(path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(response.statusText || 'Network error');
      }
      // In this simple example we store the path; actual parsing is omitted
      this.model = { path };
    } catch (err) {
      throw new Error(`Failed to load model at ${path}: ${err.message}`);
    }
  }
}
