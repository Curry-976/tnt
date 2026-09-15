"use client";

import { useEffect, useRef } from "react";
import { FLY_TO_CART_EVENT, type FlyToCartDetail } from "@/lib/fly-to-cart";

// Global, mounted once at the root: listens for "add to cart" events fired
// from anywhere (product page, quick-add cards) and animates a cloned
// product image flying — bubble-style — from its source position into the
// nav cart icon, then gives the icon a little bump.
export function FlyToCartAnimation() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(event: Event) {
      const { imageUrl, fromRect } = (event as CustomEvent<FlyToCartDetail>).detail;
      const layer = layerRef.current;
      const cartEl = document.getElementById("cart-icon");
      if (!layer || !cartEl) return;

      const cartRect = cartEl.getBoundingClientRect();
      const bubble = document.createElement("div");
      bubble.className = "fly-to-cart-bubble";
      bubble.style.backgroundImage = `url(${imageUrl})`;
      bubble.style.width = `${fromRect.width}px`;
      bubble.style.height = `${fromRect.height}px`;
      bubble.style.top = `${fromRect.top}px`;
      bubble.style.left = `${fromRect.left}px`;
      layer.appendChild(bubble);

      const dx = cartRect.left + cartRect.width / 2 - (fromRect.left + fromRect.width / 2);
      const dy = cartRect.top + cartRect.height / 2 - (fromRect.top + fromRect.height / 2);

      // Force layout before flipping to the target state so the transition runs.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      bubble.offsetWidth;
      requestAnimationFrame(() => {
        bubble.style.transform = `translate(${dx}px, ${dy}px) scale(0.1)`;
        bubble.style.opacity = "0";
        bubble.style.borderRadius = "50%";
      });

      let done = false;
      const cleanup = () => {
        if (done) return;
        done = true;
        bubble.remove();
        cartEl.classList.remove("cart-bump");
        // Re-trigger the bump animation even if it's already mid-run.
        void cartEl.offsetWidth;
        cartEl.classList.add("cart-bump");
        setTimeout(() => cartEl.classList.remove("cart-bump"), 400);
      };
      bubble.addEventListener("transitionend", cleanup);
      setTimeout(cleanup, 900);
    }

    window.addEventListener(FLY_TO_CART_EVENT, handle);
    return () => window.removeEventListener(FLY_TO_CART_EVENT, handle);
  }, []);

  return <div ref={layerRef} className="fly-to-cart-layer" aria-hidden="true" />;
}
