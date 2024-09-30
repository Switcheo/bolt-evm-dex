import { Colors } from "./styled";

const white = "#FFFFFF";
const black = "#000000";

export function colors(): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: "#FFFFFF",
    text2: "#C3C5CB",
    text3: "#6C7284",
    text4: "#565A69",
    text5: "#2C2F36",

    textDark: "#272727",
    textLight: "#FFFFFF",

    // backgrounds / greys
    rootBg: "#16142A",
    glassBg: "linear-gradient(to right, rgba(51,51,51, 0.35), rgba(0,0,0, 0.35))",
    glassRedBg: "linear-gradient(to right, rgba(255,0,0, 0.35), rgba(153,0,0, 0.35))",
    white10: "rgba(255,255,255,0.1)",
    white25: "rgba(255,255,255,0.25)",
    grey10: "rgba(242,242,242,0.1)",
    grey25: "rgba(242,242,242,0.25)",
    grey50: "rgba(242,242,242,0.5)",
    grey: "rgba(242,242,242,1)",
    bg1: "#212429",
    bg2: "#2C2F36",
    bg3: "#40444F",
    bg4: "#565A69",
    bg5: "#6C7284",

    //specialty colors
    modalBG: "rgba(0,0,0,.425)",
    advancedBG: "rgba(0,0,0,0.1)",

    //primary colors
    primary1: "#2172E5",
    primary2: "#3680E7",
    primary3: "#4D8FEA",
    primary4: "#376bad70",
    primary5: "#153d6f70",

    // primary gradient
    primaryGradient: "linear-gradient(to right, #81e1ff 0%, #1f77fd 34%, #647dfd 67%, #b57cfe 100%)",
    greyGradient5: "linear-gradient(to right, rgba(164, 164, 164, 0.05), rgba(215, 215, 215, 0.05))",
    greyGradient10: "linear-gradient(to right, rgba(164, 164, 164, 0.1), rgba(215, 215, 215, 0.1))",

    // color text
    primaryText1: "#6da8ff",

    // secondary colors
    secondary1: "#2172E5",
    secondary2: "#17000b26",
    secondary3: "#17000b26",

    // other
    red1: "#FD4040",
    red2: "#F82D3A",
    red3: "#D60000",
    green1: "#27AE60",
    yellow1: "#FFE270",
    yellow2: "#F3841E",
    blue1: "#2172E5",

  };
}
