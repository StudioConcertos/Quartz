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
  modules: ["@nuxtjs/supabase", "@pinia/nuxt", "@unocss/nuxt"],
  supabase: {
    redirectOptions: {
      login: "/",
      callback: "/atelier",
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
});
