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
  imports: {
    dirs: ["types/*.ts"],
  },
  modules: ["@nuxtjs/supabase", "@pinia/nuxt", "@unocss/nuxt", "@vueuse/nuxt"],
  supabase: {
    redirectOptions: {
      login: "/auth",
      callback: "/atelier/",
      exclude: ["/"],
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
});
