import { localStorage, storage } from './localStorage.js';

/** *
 * Http module
 */
class Http {
  /** *
   * Create request that returns to fetch
   * @param {string} url -  http url
   * @param {string} method - http method
   * @param {any} data - http data
   * @returns {Request}
   * @private
   */
  __ajax(url, method, data) {
    const options = {
      method,
      mode: 'cors',
      credentials: 'include'
    };

    if (data) {
      options.body = data;
    }

    const jwt = storage.get("jwt")
    if (jwt != null) {
      options.headers = {
        'Authorization': `Bearer ${jwt}`
      };
    }
    return new Request(url, options);
  }

  /** *
   * Ajax get request
   * @param {string} url - get request url
   * @returns {Promise<{data: any, status: number}>}
   */
  async get(url) {
    const response = await fetch(this.__ajax(url, 'GET', null));

    const responseData = await response.json();

    return {
      status: response.status,
      data: responseData
    };
  }

  /** *
   * Ajax post request
   * @param {string} url - post request url
   * @param {any} data - post request data
   * @param {boolean} photo - isPhoto?
   * @returns {Promise<{data: any, status: number}>}
   */
  async post(url, data, photo = false) {
    const response = await fetch(this.__ajax(url, 'POST', photo ? data : JSON.stringify(data)));
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const json = isJson && await response.json();

    return {
      status: response.status,
      data: json
    };
  }

  /** *
   * Ajax delete request
   * @param {string} url - post request url
   * @param {any} data - post request data
   * @param {boolean} photo - isPhoto?
   * @returns {Promise<{data: any, status: number}>}
   */
  async delete(url, data) {
    const response = await fetch(this.__ajax(url, 'DELETE', JSON.stringify(data)));
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const json = isJson && await response.json();

    return {
      status: response.status,
      data: json
    };
  }
}

export const http = new Http();