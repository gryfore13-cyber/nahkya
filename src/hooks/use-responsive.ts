import * as React from "react";

/* Breakpoint definitions aligned with Nahkya responsive spec */
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  largeDesktop: 1536,
} as const;

interface ResponsiveState {
  /** Viewport width in pixels */
  width: number;
  /** Viewport height in pixels */
  height: number;
  /** < 768px */
  isMobile: boolean;
  /** 768px - 1023px */
  isTablet: boolean;
  /** 1024px - 1279px */
  isSmallLaptop: boolean;
  /** 1280px - 1535px */
  isDesktop: boolean;
  /** >= 1536px */
  isWidescreen: boolean;
  /** >= 1024px (tablet landscape and up) */
  isDesktopOrUp: boolean;
  /** < 1024px (mobile + tablet portrait) */
  isBelowDesktop: boolean;
  /** Primary input is touch (no hover capability) */
  isTouch: boolean;
  /** Screen is in portrait orientation */
  isPortrait: boolean;
  /** Screen is in landscape orientation */
  isLandscape: boolean;
}

function getResponsiveState(width: number, height: number): ResponsiveState {
  return {
    width,
    height,
    isMobile: width < BREAKPOINTS.mobile,
    isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
    isSmallLaptop: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop && width < BREAKPOINTS.largeDesktop,
    isWidescreen: width >= BREAKPOINTS.largeDesktop,
    isDesktopOrUp: width >= BREAKPOINTS.tablet,
    isBelowDesktop: width < BREAKPOINTS.tablet,
    isTouch: typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
    isPortrait: height > width,
    isLandscape: width >= height,
  };
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = React.useState<ResponsiveState>(() =>
    getResponsiveState(
      typeof window !== "undefined" ? window.innerWidth : 1280,
      typeof window !== "undefined" ? window.innerHeight : 800
    )
  );

  React.useEffect(() => {
    const handleResize = () => {
      setState(getResponsiveState(window.innerWidth, window.innerHeight));
    };

    // Initial measurement
    handleResize();

    window.addEventListener("resize", handleResize, { passive: true });

    // Also listen for orientation changes
    window.addEventListener("orientationchange", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return state;
}

/** Hook that returns true when the viewport matches a minimum width */
export function useMinWidth(minWidth: number): boolean {
  const [matches, setMatches] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= minWidth : false
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${minWidth}px)`);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [minWidth]);

  return matches;
}

/** Hook that returns true when the viewport matches a maximum width */
export function useMaxWidth(maxWidth: number): boolean {
  const [matches, setMatches] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < maxWidth : false
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${maxWidth - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [maxWidth]);

  return matches;
}

/** Hook for detecting if primary input is touch (for touch target sizing) */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia("(hover: none)");
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    setIsTouch(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}
