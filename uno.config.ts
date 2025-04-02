import {
  defineConfig,
  presetIcons,
  presetUno,
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
    presetUno(),
    presetWebFonts({
      provider: "fontshare",
      fonts: createFontConfig(fonts),
    }),
  ],
  transformers: [transformerDirectives()],
});
