"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Rendered on the client so the prerendered shell never bakes in a stale year. */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <>{year}</>;
}
