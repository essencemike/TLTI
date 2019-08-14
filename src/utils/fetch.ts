import BlockFetch from './BlockFetch';

export function fetchInterval({ url = '', intervals = 2, intervalsType = '', params = {} } = {}) {
  const isFetch = BlockFetch(intervalsType || url, intervals);
  return !isFetch ? new Promise((resolve, reject) => {
    if (isFetch) {
      resolve('');
    } else {
      reject(new Error('wait...'));
    }
  }) : fetch(url, params).then((response) => {
    return response.text();
  });
}

export function fetchTimely(url: string, params?: object | any) {
  return fetch(url, params).then((response) => {
    return response.text();
  });
}
