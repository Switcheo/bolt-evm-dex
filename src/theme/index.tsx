import { transparentize } from "polished";
import React, { useMemo } from "react";
import { Text, TextProps } from "rebass";
import styled, {
  createGlobalStyle,
  css,
  DefaultTheme,
  ThemeProvider as StyledComponentsThemeProvider,
} from "styled-components";
import { colors } from "./colors";
// import { useIsDarkMode } from "../state/user/hooks";
import { Colors } from "./styled";
import { opacify } from "./utils";
import "@fontsource-variable/dm-sans";

export * from "./components";

const MEDIA_WIDTHS = {
  upToExtraSmall: 500,
  upToSmall: 720,
  upToMedium: 960,
  upToLarge: 1280,
};

export const BREAKPOINTS = {
  xs: 396,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
  xxxl: 1920,
};

const mediaWidthTemplates: {
  [width in keyof typeof MEDIA_WIDTHS]: typeof css;
} = Object.keys(MEDIA_WIDTHS).reduce((accumulator, size) => {
  (accumulator as any)[size] = (a: any, b: any, c: any) => css`
    @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
      ${css(a, b, c)}
    }
  `;
  return accumulator;
}, {}) as any;

export enum TRANSITION_DURATIONS {
  slow = 500,
  medium = 250,
  fast = 125,
}

const transitions = {
  duration: {
    slow: `${TRANSITION_DURATIONS.slow}ms`,
    medium: `${TRANSITION_DURATIONS.medium}ms`,
    fast: `${TRANSITION_DURATIONS.fast}ms`,
  },
  timing: {
    ease: "ease",
    in: "ease-in",
    out: "ease-out",
    inOut: "ease-in-out",
  },
};

const opacities = {
  hover: 0.6,
  click: 0.4,
  disabled: 0.5,
  enabled: 1,
};

export function theme(darkMode: boolean): DefaultTheme {
  return {
    ...colors(darkMode),

    breakpoint: BREAKPOINTS,
    transition: transitions,
    opacity: opacities,
    backgroundTable: "#0D111C",
    hoverDefault: opacify(8, "#98A1C0"),
    backgroundSurface: colors(true).bg1,
    backgroundOutline: opacify(24, "#98A1C0"),
    deepShadow:
      "12px 16px 24px rgba(0, 0, 0, 0.24), 12px 8px 12px rgba(0, 0, 0, 0.24), 4px 4px 8px rgba(0, 0, 0, 0.32);",

    grids: {
      sm: 8,
      md: 12,
      lg: 24,
    },

    //shadows
    shadow1: darkMode ? "#000" : "#2F80ED",

    // media queries
    mediaWidth: mediaWidthTemplates,

    // css snippets
    flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
    flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
  };
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = true;
  // const darkMode = false;

  const themeObject = useMemo(() => theme(darkMode), [darkMode]);

  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>;
}

const TextWrapper = styled(Text)<{ color: keyof Colors }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`;

export const TYPE = {
  main(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"text2"} {...props} />;
  },
  link(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"primary1"} {...props} />;
  },
  black(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"text1"} {...props} />;
  },
  white(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"white"} {...props} />;
  },
  body(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={16} color={"text1"} {...props} />;
  },
  largeHeader(props: TextProps) {
    return <TextWrapper fontWeight={600} fontSize={24} {...props} />;
  },
  mediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={20} {...props} />;
  },
  subHeader(props: TextProps) {
    return <TextWrapper fontWeight={400} fontSize={14} {...props} />;
  },
  small(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={11} {...props} />;
  },
  blue(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"blue1"} {...props} />;
  },
  yellow(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"yellow1"} {...props} />;
  },
  darkGray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"text3"} {...props} />;
  },
  gray(props: TextProps) {
    return <TextWrapper fontWeight={500} color={"bg3"} {...props} />;
  },
  italic(props: TextProps) {
    return <TextWrapper fontWeight={500} fontSize={12} fontStyle={"italic"} color={"text2"} {...props} />;
  },
  error({ error, ...props }: { error: boolean } & TextProps) {
    return <TextWrapper fontWeight={500} color={error ? "red1" : "text2"} {...props} />;
  },
};

export const FixedGlobalStyle = createGlobalStyle`
html, input, textarea, button {
  font-family: 'DM Sans Variable', sans-serif;
  font-display: fallback;
}
@supports (font-variation-settings: normal) {
  html, input, textarea, button {
    font-family: 'DM Sans Variable', sans-serif;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}

 a {
   color: ${colors(false).blue1}; 
 }

* {
  box-sizing: border-box;
}

button {
  user-select: none;
}

html {
  font-size: 16px;
  font-variant: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
  
}
`;

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg2};
}

body {
  min-height: 100vh;
  background-position: 0 -30vh;
  background-repeat: no-repeat;
  background-image: ${({ theme }) =>
    `radial-gradient(50% 50% at 50% 50%, ${transparentize(0.9, theme.primary1)} 0%, ${transparentize(
      1,
      theme.bg1,
    )} 100%)`};
}
`;
