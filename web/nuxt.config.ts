export default defineNuxtConfig({
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
    "@nuxt/content",
    "@nuxt/image",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@tresjs/nuxt",
    "@unocss/nuxt",
    "@vee-validate/nuxt",
    "@vueuse/nuxt",
    "nuxt-resend",
  ],
  extends: ["@d0rich/nuxt-content-mermaid"],
  supabase: {
    redirectOptions: {
      login: "/auth",
      callback: "/auth/callback",
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
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
  vite: {
    server: {
      allowedHosts: ["*.trycloudflare.com"],
    },
  },
});
