// self.addEventListener("push", (event) => {
//   if (!event.data) return;

//   const data = event.data.json();
//   const title = data.title || "Notification";
//   const options = {
//     body: data.body,
//     icon: data.icon || "/icons/icon-192.png",
//     badge: data.badge || "/icons/badge-72.png",
//     data: { url: data.url }
//   };

//   // Show OS-level notification
//   event.waitUntil(self.registration.showNotification(title, options));

//   // Also forward message to client (your React app)
//   event.waitUntil(
//     self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
//       for (const client of clients) {
//         client.postMessage({ type: "PUSH_NOTIFICATION", payload: data });
//       }
//     })
//   );
// });


// public/sw.js
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  // Forward to all open clients (your React app)
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        client.postMessage({
          type: "PUSH_NOTIFICATION",
          payload: data,
        });
      }
    })
  );
});

// optional: handle notification click if you do show notifications later
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});

