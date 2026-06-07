const channelName = "lms-data-updated";

export function publishDataUpdate(resource) {
  const payload = { resource, timestamp: Date.now() };

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(channelName, { detail: payload }));
  }

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(channelName);
    channel.postMessage(payload);
    channel.close();
  }
}

export function subscribeDataUpdates(handler) {
  const disposers = [];

  if (typeof window !== "undefined") {
    const windowHandler = (event) => handler(event.detail || {});
    window.addEventListener(channelName, windowHandler);
    disposers.push(() => window.removeEventListener(channelName, windowHandler));
  }

  if (typeof BroadcastChannel !== "undefined") {
    const channel = new BroadcastChannel(channelName);
    const channelHandler = (event) => handler(event.data || {});
    channel.addEventListener("message", channelHandler);
    disposers.push(() => {
      channel.removeEventListener("message", channelHandler);
      channel.close();
    });
  }

  return () => {
    disposers.forEach((dispose) => dispose());
  };
}
