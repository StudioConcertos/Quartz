<template>
  <LandingNavbar />
  <LandingHero />
  <NuxtImg
    ref="image"
    src="/images/product.png"
    alt="product"
    class="product"
    fit="contain"
  />
  <section class="h-screen flex items-center justify-center">
    <p>...</p>
  </section>
  <LandingFooter />
</template>

<style scoped lang="postcss">
.product {
  @apply relative left-1/2 -translate-x-1/2 -mt-[15vh];
  @apply rounded-lg w-[80vw];
}
</style>

<script setup lang="ts">
useSeoMeta({
  title: "Quartz",
  ogTitle: "Quartz",
  description: "Open source slides engine; built for ambitious presenters.",
  ogDescription: "Open source slides engine; built for ambitious presenters.",
  ogUrl: "https://quartz.graphics/",
});
</script>
