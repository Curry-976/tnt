export const FLY_TO_CART_EVENT = "tnt:fly-to-cart";

export type FlyToCartDetail = { imageUrl: string; fromRect: DOMRect };

export function flyToCart(detail: FlyToCartDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<FlyToCartDetail>(FLY_TO_CART_EVENT, { detail }));
}

export function flyToCartFromElement(el: Element | null, imageUrl: string | undefined | null) {
  if (!el || !imageUrl) return;
  flyToCart({ imageUrl, fromRect: el.getBoundingClientRect() });
}
