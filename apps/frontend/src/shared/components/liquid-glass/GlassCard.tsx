import type { CSSProperties, ReactNode, RefObject } from "react";
import { GlassCard as DevHubGlassCard } from "@developer-hub/liquid-glass";

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  padding?: string;
  cornerRadius?: number;
  blurAmount?: number;
  displacementScale?: number;
  shadowMode?: boolean;
  mouseContainer?: RefObject<HTMLElement | null> | null;
  onClick?: () => void;
}

/**
 * Apple-WWDC-style GlassCard powered by `@developer-hub/liquid-glass`.
 *
 * Uses an SVG-filter + hardware-accelerated backdrop to bend content behind
 * the card. Great for modal surfaces and card containers where you want a
 * physical, tactile edge glow rather than a flat frosted rectangle.
 */
export const GlassCard = ({
  children,
  className,
  style,
  padding = "16px 20px",
  cornerRadius = 20,
  blurAmount = 8,
  displacementScale = 40,
  shadowMode = false,
  mouseContainer,
  onClick,
}: GlassCardProps) => (
  <DevHubGlassCard
    className={className}
    style={style}
    padding={padding}
    cornerRadius={cornerRadius}
    blurAmount={blurAmount}
    displacementScale={displacementScale}
    shadowMode={shadowMode}
    mouseContainer={mouseContainer}
    onClick={onClick}
  >
    {children}
  </DevHubGlassCard>
);

export default GlassCard;
