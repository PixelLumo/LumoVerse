export const helpers = {
  generateId: () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  delay: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  deepClone: (obj) => JSON.parse(JSON.stringify(obj)),
};
