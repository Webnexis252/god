"use client";

import { useSyncExternalStore } from "react";

// The preloader covers the page while <html data-entrance="loading">.
const subscribeToEntrance = (notify) => {
  const observer = new MutationObserver(notify);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-entrance"],
  });

  return () => observer.disconnect();
};

const readEntranceOver = () =>
  document.documentElement.dataset.entrance !== "loading";

const readEntranceOverOnServer = () => true;

// True once the preloader's panels have started to part (and on every later
// page, where there is no preloader at all).
export default function useEntranceOver() {
  return useSyncExternalStore(
    subscribeToEntrance,
    readEntranceOver,
    readEntranceOverOnServer
  );
}
