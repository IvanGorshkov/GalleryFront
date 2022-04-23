/** *
 * Local storage
 */
class LocalStorage {
  /** *
   * Get item
   * @param {string} key - key name
   * @returns {string}
   */
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.log(err.message);
      return undefined;
    }
  }

  /** *
   * Set item
   * @param {string} key - key name
   * @param {string} val - value
   */
  set(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (err) {
      console.log(err.message);
    }
  }

  /** *
   * Remove item
   * @param {string} key - key name
   */
  del(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.log(err.message);
    }
  }
}

export const storage = new LocalStorage();