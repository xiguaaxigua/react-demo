/**
 * Created by go_songs on 2017/3/7.
 */
const DEFAULT_CONFIG = {
  key: null,
  v: 1.3,
  protocol: window.location.protocol || 'https:',
  hostAndPath: 'webapi.amap.com/maps',
  plugin: [],
  callback: 'mapInitCallback',
};

const lazyLoadMapApi = (config = DEFAULT_CONFIG) => {
  const _config = {...DEFAULT_CONFIG, ...config};

  const getScriptSrc = (cfg) => {
    let scriptSrc = `${cfg.protocol}//${cfg.hostAndPath}?v=${cfg.v}&key=${cfg.key}&callback=${cfg.callback}`;
    if (cfg.plugin.length) scriptSrc += `&plugin=${cfg.plugin.join(',')}`;
    return scriptSrc;
  };

  if (window.AMap) return Promise.resolve();
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = getScriptSrc(_config);
  const scriptLoadingPromise = new Promise((resolve, reject) => {
    // api 加载成功的回调函数
    window[_config.callback] = () => {
      return resolve();
    };
    script.onerror = error => reject(error);
  });
  document.head.appendChild(script);

  // const uiScript = document.createElement('script');
  // uiScript.type = 'text/javascript';
  // uiScript.async = true;
  // uiScript.defer = true;
  // uiScript.src = `//webapi.amap.com/ui/1.0/main.js`;
  // document.head.appendChild(uiScript);
  return scriptLoadingPromise;
};
export default lazyLoadMapApi;