import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Quartz",
    },
  },
  devtools: {
    enabled: true,
  },
  modules: ["@pinia/nuxt", "@unocss/nuxt"],
});
