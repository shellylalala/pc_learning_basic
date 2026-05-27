import * as path from "node:path";
import { defineConfig } from "@rspress/core";

export default defineConfig({
  globalStyles: path.join(__dirname, "styles/custom.css"),
  base: "/pc_learning_basic/",
  root: path.join(__dirname, "docs"),
  title: "赛博藏经阁",
  lang: "zh",
  icon: "/robot2.png",
  logo: {
    light: "/robot2.png",
    dark: "/robot2.png",
  },
  logoText: "赛博藏经阁",
  themeConfig: {
    lastUpdated: true,
    editLink: {
      docRepoBaseUrl:
        "https://github.com/shellylalala/pc_learning_basic/tree/master/docs",
    },
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/shellylalala/pc_learning_basic",
      },
    ],
  },
});
