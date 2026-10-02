"use client";

import { useSyncExternalStore } from "react";

// The preloader covers the page while <html data-entrance="loading">.
const subscribe = (notify) => {
  const observer = new MutationObserver(notify);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-entrance"],
  });

  return () => observer.disconnect();
};

const isOver = () => document.documentElement.dataset.entrance !== "loading";

const isOverOnServer = () => true;

// True once the preloader's panels have started to part. Arriving from another
// page there is no preloader, so it is true from the start.
export default function useCaseEntrance() {
  return useSyncExternalStore(subscribe, isOver, isOverOnServer);
}
