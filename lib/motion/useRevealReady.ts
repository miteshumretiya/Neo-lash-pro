"use client";

import { useState } from "react";
import { selectRevealReady, useExperience } from "@/lib/store/experience";

/**
 * True once entrance animations may run (preloader done, curtain lifting).
 * Latches per component so a later page transition never reverts content
 * that has already been revealed.
 */
export function useRevealReady() {
  const ready = useExperience(selectRevealReady);
  const [armed, setArmed] = useState(ready);
  if (ready && !armed) setArmed(true);
  return armed;
}
