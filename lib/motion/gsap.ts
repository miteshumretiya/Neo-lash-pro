"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

let registered = false;

/** Registers the plugins used site-wide and the shared easing curves. */
export function setupGsap() {
  if (registered || typeof window === "undefined") return;
  registered = true;
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);

  // The three curves every animation on the site draws from.
  CustomEase.create("luxe", "0.16, 1, 0.3, 1");
  CustomEase.create("silk", "0.77, 0, 0.175, 1");
  CustomEase.create("glide", "0.33, 1, 0.68, 1");

  gsap.defaults({ ease: "luxe", duration: 1.1 });
  ScrollTrigger.config({ ignoreMobileResize: true });
}

setupGsap();

export { gsap, ScrollTrigger, SplitText, CustomEase, useGSAP };
