import { useEffect, useState } from "react";

export const Themes: string[] = [
  "bubblegum",
  "buttercup",
  "indigo",
  "lavender",
  "magenta",
  "navy",
  "orange",
  "oxblood",
  "periwinkle",
  "poppy",
  "purple",
  "seafoam",
  "sky",
  "tan",
  "teal",
  "yellow",
];

export const Theme = (theme: string): string => {
  switch (theme) {
    case "white":
      return "#ffffff";
    case "bubblegum":
      return "rgb(236,118,203)";
    case "buttercup":
      return "rgb(255, 238,139)";
    case "indigo":
      return "rgb(47,9,102)";
    case "lavender":
      return "rgb(200,200,255)";
    case "magenta":
      return "rgb(155,23,108)";
    case "navy":
      return "rgb(0,21,57)";
    case "orange":
      return "rgb(255,127,59)";
    case "oxblood":
      return "rgb(65,8,14)";
    case "periwinkle":
      return "rgb(121,122,255)";
    case "poppy":
      return "rgb(255,83,85)";
    case "purple":
      return "rgb(133,71,240)";
    case "seafoam":
      return "rgb(196,231,225)";
    case "sky":
      return "rgb(96,138,255)";
    case "tan":
      return "rgb(187,144,115)";
    case "teal":
      return "rgb(28,132,147)";
    case "yellow":
      return "rgb(246,209,67)";
    default:
      console.log("error");
      return "";
  }
};

export const Mode = (theme: string): string => {
  switch (theme) {
    case "indigo":
    case "magenta":
    case "navy":
    case "oxblood":
    case "purple":
      return "rgb(243,243,248)";
    default:
      return "#000000";
  }
};

export const ThemeRGB = (theme: string): string => {
  switch (theme) {
    case "white":
      return "255, 255, 255";
    case "bubblegum":
      return "236, 118, 203";
    case "buttercup":
      return "255, 238, 139";
    case "indigo":
      return "47, 9, 102";
    case "lavender":
      return "200, 200, 255";
    case "magenta":
      return "155, 23, 108";
    case "navy":
      return "0, 21, 57";
    case "orange":
      return "255, 127, 59";
    case "oxblood":
      return "65, 8, 14";
    case "periwinkle":
      return "121, 122, 255";
    case "poppy":
      return "255, 83, 85";
    case "purple":
      return "133, 71, 240";
    case "seafoam":
      return "196, 231, 225";
    case "sky":
      return "96, 138, 255";
    case "tan":
      return "187, 144, 115";
    case "teal":
      return "28, 132, 147";
    case "yellow":
      return "246, 209, 67";
    default:
      console.log("error");
      return "";
  }
};
