import { FlattenSimpleInterpolation, ThemedCssFunction } from "styled-components";

export type Color = string;
export interface Colors {
  // base
  white: Color;
  black: Color;

  // text
  text1: Color;
  text2: Color;
  text3: Color;
  text4: Color;
  text5: Color;
  textDark: Color;
  textLight: Color;

  // backgrounds / greys
  rootBg: Color;
  glassBg: Color;
  white10: Color;
  white25: Color;
  grey50: Color;
  grey: Color;
  grey25: Color;
  grey50: Color;
  grey10: Color;
  bg1: Color;
  bg2: Color;
  bg3: Color;
  bg4: Color;
  bg5: Color;

  modalBG: Color;
  advancedBG: Color;

  //blues
  primary1: Color;
  primary2: Color;
  primary3: Color;
  primary4: Color;
  primary5: Color;

  primaryGradient: Color;
  greyGradient5: Color;
  greyGradient10: Color;

  primaryText1: Color;

  // pinks
  secondary1: Color;
  secondary2: Color;
  secondary3: Color;

  // other
  red1: Color;
  red2: Color;
  red3: Color;
  green1: Color;
  yellow1: Color;
  yellow2: Color;
  blue1: Color;
  grey50: Color;
}

export interface Grids {
  sm: number;
  md: number;
  lg: number;
}

declare module "styled-components" {
  export interface DefaultTheme extends Colors {
    grids: Grids;

    // shadows
    shadow1: string;

    // border
    border1: string;

    // media queries
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>;
      upToSmall: ThemedCssFunction<DefaultTheme>;
      upToMedium: ThemedCssFunction<DefaultTheme>;
      upToLarge: ThemedCssFunction<DefaultTheme>;
    };

    // css snippets
    flexColumnNoWrap: FlattenSimpleInterpolation;
    flexRowNoWrap: FlattenSimpleInterpolation;
  }
}
