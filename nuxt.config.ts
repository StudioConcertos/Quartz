export default defineNuxtConfig({
  app: {
    head: {
      title: "Quartz",
    },
  },
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  imports: {
    dirs: ["types/*.ts"],
  },
  modules: [
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@tresjs/nuxt",
    "@unocss/nuxt",
    "@vueuse/nuxt",
  ],
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
  tres: {
    devtools: true,
    glsl: true,
  },
  compatibilityDate: "2024-08-15",
});
