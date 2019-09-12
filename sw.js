self.addEventListener("error", function(e) {
  self.clients.matchAll().then(function(clients) {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: "ERROR",
        msg: e.message || null,
        stack: e.error ? e.error.stack : null
      });
    }
  });
});

self.addEventListener("unhandledrejection", function(e) {
  self.clients.matchAll().then(function(clients) {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: "REJECTION",
        msg: e.reason ? e.reason.message : null,
        stack: e.reason ? e.reason.stack : null
      });
    }
  });
});

const workboxVersion = '4.3.1';

importScripts(`https://cdn.jsdelivr.net/npm/workbox-cdn@${workboxVersion}/workbox/workbox-sw.js`);

workbox.setConfig({
  debug: false,
  modulePathPrefix: `https://cdn.jsdelivr.net/npm/workbox-cdn@${workboxVersion}/workbox/`
});
workbox.core.skipWaiting();
workbox.core.clientsClaim();

const maxEntries = 100;


// GA 统计不缓存
workbox.routing.registerRoute(
  new RegExp('^https://ga\.giuem\.com'),
  new workbox.strategies.NetworkOnly()
);

// 图片、样式表、字体文件等
workbox.routing.registerRoute(
  // css/js
  new RegExp(/.*\.(css|js)/),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "fcj:static",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries
      })
    ]
  })
);

workbox.routing.registerRoute(
  // img
  new RegExp(/.*\.(?:png|jpg|jpeg|svg|gif)/),
  workbox.strategies.cacheFirst({
    cacheName: "fcj:img",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  // Cache Fonts files
  /.*\.(woff|woff2)/,
  workbox.strategies.cacheFirst({
      cacheName: 'fcj:font',
      plugins: [
          // 使用 expiration 插件实现缓存条目数目和时间控制
          new workbox.expiration.Plugin({
              // 最大保存项目
              maxEntries,
              // 缓存 30 天
              maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
          // 使用 cacheableResponse 插件缓存状态码为 0 的请求
          new workbox.cacheableResponse.Plugin({
              statuses: [0, 200],
          }),
      ]
  })
);

// 其他的默认规则
workbox.routing.setDefaultHandler(
  workbox.strategies.networkFirst({
      options: [{
          // 超过 3s 请求没有响应则 fallback 到 cache
          networkTimeoutSeconds: 3,
      }]
  })
);