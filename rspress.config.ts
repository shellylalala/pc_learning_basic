import * as path from "node:path";
import { defineConfig } from "@rspress/core";

export default defineConfig({
  globalStyles: path.join(__dirname, "styles/custom.css"),
  base: "/pc_learning_basic/",
  root: path.join(__dirname, "docs"),
  title: "赛博藏经阁",
  icon: "/robot2.png",
  logo: {
    light: "/robot2.png",
    dark: "/robot2.png",
  },
  themeConfig: {
    lastUpdated: true,
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/shellylalala/pc_learning_basic",
      },
    ],
  },
});
