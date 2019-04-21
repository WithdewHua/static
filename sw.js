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

importScripts("https://g.alicdn.com/kg/workbox/3.3.0/workbox-sw.js");
workbox.setConfig({
  debug: false,
  modulePathPrefix: "https://g.alicdn.com/kg/workbox/3.3.0/"
});
workbox.skipWaiting();
workbox.clientsClaim();

var cacheList = ["/"];

workbox.routing.registerRoute(
  function(event) {
    // 需要缓存的HTML路径列表
    if (event.url.host === "withdewhua.space") {
      if (~cacheList.indexOf(event.url.pathname)) return true;
      else return false;
    } else {
      return false;
    }
  },
  workbox.strategies.networkFirst({
    cacheName: "fcj:html",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 10
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp(/https:\/\/cdn\.jsdelivr\.net\/((?!img).)*/),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "fcj:static",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp("https://cdn1\.lncld\.net/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "fcj:static",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp(/https:\/\/(\w)+\.alicdn\.com\//),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "fcj:static",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 20
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp("https://pic\.superbed\.cn/"),
  workbox.strategies.cacheFirst({
    cacheName: "fcj:img",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 20,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp(/https:\/\/(\w)+\.loli\.net/),
  workbox.strategies.cacheFirst({
    cacheName: "fcj:img",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  })
);

workbox.routing.registerRoute(
  new RegExp(/https:\/\/cdn\.jsdelivr\.net\/gh\/WithdewHua\/static@latest\/img\//),
  workbox.strategies.cacheFirst({
    cacheName: "fcj:img",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      }),
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  })
);
