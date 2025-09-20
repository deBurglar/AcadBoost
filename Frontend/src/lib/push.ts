export async function subscribeToPush() {
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");

    const perm = await Notification.requestPermission();
    if (perm !== "granted") {
      console.warn("Notifications not granted by user");
      return;
    }

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY // from .env
    });

    await fetch("http://localhost:5000/admin/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub)
    });

    console.log("✅ Push subscription successful");
  } catch (err) {
    console.error("❌ Push subscription failed:", err);
  }
}

