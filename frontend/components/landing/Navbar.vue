<template>
  <header
    class="landing-header"
    :class="{ 'opacity-0! pointer-events-none': isScrolling }"
  >
    <h1>Quartz</h1>
    <p>Studio Concertos @ {{ new Date().getFullYear() }}</p>
    <NuxtLink class="cta primaryButton" to="/auth">Sign In</NuxtLink>
  </header>
</template>

<style scoped lang="postcss">
.landing-header {
  @apply fixed w-screen h-[10vh] z-999;
  @apply flex items-center justify-between;
  @apply px-10 text-sm transition-opacity duration-500;
  @apply select-none opacity-80;
}
</style>

<script setup lang="ts">
const isScrolling = ref(false);

onMounted(() => {
  window.addEventListener("scroll", () => {
    isScrolling.value = window.scrollY > 50;
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", () => {
    isScrolling.value = window.scrollY > 50;
  });
});
</script>
