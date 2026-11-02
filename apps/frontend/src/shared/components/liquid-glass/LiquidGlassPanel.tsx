import type { CSSProperties, ReactNode, RefObject } from "react";
import LiquidGlassNkzw from "@nkzw/liquid-glass";

export interface LiquidGlassPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 'standard' | 'polar' | 'prominent' | 'shader' */
  mode?: "standard" | "polar" | "prominent" | "shader";
  borderRadius?: number;
  blurAmount?: number;
  displacementScale?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  saturation?: number;
  overLight?: boolean;
  padding?: string;
  mouseContainer?: RefObject<HTMLElement | null> | null;
  onClick?: () => void;
}

/**
 * React Liquid Glass panel — powered by `@nkzw/liquid-glass`.
 *
 * Renders real SVG displacement + chromatic aberration (bending + dispersion)
 * around the wrapped children. Zero runtime dependencies.
 */
export const LiquidGlassPanel = ({
  children,
  className,
  style,
  mode = "standard",
  borderRadius = 24,
  blurAmount = 6,
  displacementScale = 60,
  aberrationIntensity = 8,
  elasticity = 0.4,
  saturation = 1.2,
  overLight = false,
  padding = "12px 20px",
  mouseContainer,
  onClick,
}: LiquidGlassPanelProps) => (
  <LiquidGlassNkzw
    className={className}
    style={style}
    mode={mode}
    borderRadius={borderRadius}
    blurAmount={blurAmount}
    displacementScale={displacementScale}
    aberrationIntensity={aberrationIntensity}
    elasticity={elasticity}
    saturation={saturation}
    overLight={overLight}
    padding={padding}
    mouseContainer={mouseContainer}
    onClick={onClick}
  >
    {children}
  </LiquidGlassNkzw>
);

export default LiquidGlassPanel;
