import { useEffect, useRef } from "react";
import { LiquidGlass } from "apple-liquid-glass-webgl";

export interface AppleLiquidGlassOptions {
  /** Milky layer, 0–1.5. */
  tint?: number;
  /** 'light' | 'dark' | 'auto'. Use `dark` behind white text. */
  tintTone?: "light" | "dark" | "auto";
  /** Blur behind the lens, ratio of the short side. */
  frost?: number;
  /** Overall opacity of the glass surface. */
  opacity?: number;
  /** What is behind the glass: 'auto' by default (page below the element). */
  backdrop?: "auto" | string;
  /** Extra material overrides — `{ refraction: number }` etc. */
  material?: Record<string, number>;
}

/**
 * Attaches a real WebGL2 Liquid Glass renderer (apple-liquid-glass-webgl) to
 * the returned ref. Falls back to CSS `backdrop-filter` when WebGL2 is not
 * available — the element gets `data-liquid-glass="webgl" | "fallback"` so
 * Tailwind can style either path.
 */
export function useAppleLiquidGlassWebGL<T extends HTMLElement>(
  options: AppleLiquidGlassOptions = {},
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let instance: InstanceType<typeof LiquidGlass> | null = null;
    try {
      instance = new LiquidGlass(el, {
        tint: options.tint,
        tintTone: options.tintTone,
        frost: options.frost,
        opacity: options.opacity,
        backdrop: options.backdrop,
        material: options.material,
      });
    } catch {
      // WebGL2 unavailable — CSS fallback stays applied via data-liquid-glass.
    }

    return () => {
      const maybeDispose = instance as unknown as {
        destroy?: () => void;
        dispose?: () => void;
      } | null;
      maybeDispose?.destroy?.();
      maybeDispose?.dispose?.();
    };
  }, [
    options.tint,
    options.tintTone,
    options.frost,
    options.opacity,
    options.backdrop,
    options.material,
  ]);

  return ref;
}
