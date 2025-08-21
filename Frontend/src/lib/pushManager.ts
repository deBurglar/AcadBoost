// export async function registerServiceWorker() {
//   if ("serviceWorker" in navigator) {
//     const reg = await navigator.serviceWorker.register("/sw.js");
//     console.log("SW registered", reg);
//     return reg;
//   }
//   throw new Error("Service Worker not supported");
// }

// export async function subscribeUser(reg: ServiceWorkerRegistration, vapidPublicKey: string) {
//   if (!("PushManager" in window)) {
//     throw new Error("Push messaging not supported");
//   }

//   // Request permission
//   const permission = await Notification.requestPermission();
//   if (permission !== "granted") throw new Error("Permission denied");

//   // Convert base64 VAPID key to UInt8Array
//   const key = urlBase64ToUint8Array(vapidPublicKey);

//   const subscription = await reg.pushManager.subscribe({
//     userVisibleOnly: true,
//     applicationServerKey: key
//   });

//   return subscription.toJSON();
// }

// function urlBase64ToUint8Array(base64String: string) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
//   const rawData = atob(base64);
//   const outputArray = new Uint8Array(rawData.length);
//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// src/utils/pushManager.ts
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported in this browser.");
  }
  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready; // make sure it's ready
  return reg;
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscribe user and return the Subscription JSON (safe to send to backend)
 */
export async function subscribeUser(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
): Promise<PushSubscriptionJSON> {
  if (!("PushManager" in window)) {
    throw new Error("PushManager is not supported.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission not granted.");
  }

  const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  // toJSON produces plain object we can POST
  // Type assertion: many browsers return PushSubscription with toJSON()
  return subscription.toJSON() as PushSubscriptionJSON;
}
