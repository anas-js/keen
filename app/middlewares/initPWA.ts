export default async function initPWA() {
  if ("serviceWorker" in navigator) {
   await navigator.serviceWorker.register("/sw.js").catch(console.error);
  }
}
