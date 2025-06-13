import {
  defineConfig,
  presetIcons,
  presetWind3,
  presetWebFonts,
  transformerDirectives,
} from "unocss";

import { fonts } from "./utils/fonts";

const createFontConfig = (fonts: readonly string[]) => {
  return fonts.reduce((map, font) => {
    const key = font.toLowerCase().replace(/\s+/g, "-");

    map[key] = font;

    return map;
  }, {} as Record<string, string>);
};

export default defineConfig({
  presets: [
    presetIcons(),
    presetWind3(),
    presetWebFonts({
      provider: "fontshare",
      fonts: createFontConfig(fonts),
      timeouts: {
        warning: 30000,
        failure: 60000,
      },
    }),
  ],
  transformers: [transformerDirectives()],
});
