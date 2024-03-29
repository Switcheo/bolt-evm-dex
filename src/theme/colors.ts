import { Colors } from "./styled";

const white = "#FFFFFF";
const black = "#000000";

export function colors(darkMode: boolean): Colors {
  return {
    // base
    white,
    black,

    // text
    text1: darkMode ? "#FFFFFF" : "#000000",
    text2: darkMode ? "#C3C5CB" : "#565A69",
    text3: darkMode ? "#6C7284" : "#888D9B",
    text4: darkMode ? "#565A69" : "#C3C5CB",
    text5: darkMode ? "#2C2F36" : "#EDEEF2",

    // backgrounds / greys
    bg1: darkMode ? "#212429" : "#FFFFFF",
    bg2: darkMode ? "#2C2F36" : "#F7F8FA",
    bg3: darkMode ? "#40444F" : "#EDEEF2",
    bg4: darkMode ? "#565A69" : "#CED0D9",
    bg5: darkMode ? "#6C7284" : "#888D9B",

    //specialty colors
    modalBG: darkMode ? "rgba(0,0,0,.425)" : "rgba(0,0,0,0.3)",
    advancedBG: darkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.6)",

    //primary colors
    primary1: darkMode ? "#2172E5" : "#ff007a",
    primary2: darkMode ? "#3680E7" : "#FF8CC3",
    primary3: darkMode ? "#4D8FEA" : "#FF99C9",
    primary4: darkMode ? "#376bad70" : "#F6DDE8",
    primary5: darkMode ? "#153d6f70" : "#FDEAF1",

    // color text
    primaryText1: darkMode ? "#6da8ff" : "#ff007a",

    // secondary colors
    secondary1: darkMode ? "#2172E5" : "#ff007a",
    secondary2: darkMode ? "#17000b26" : "#F6DDE8",
    secondary3: darkMode ? "#17000b26" : "#FDEAF1",

    // other
    red1: "#FD4040",
    red2: "#F82D3A",
    red3: "#D60000",
    green1: "#27AE60",
    yellow1: "#FFE270",
    yellow2: "#F3841E",
    blue1: "#2172E5",

    // dont wanna forget these blue yet
    // blue4: darkMode ? '#153d6f70' : '#C4D9F8',
    // blue5: darkMode ? '#153d6f70' : '#EBF4FF',
  };
}
