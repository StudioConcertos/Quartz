<template>
  <Title>Quartz</Title>
  <LandingNavbar />
  <LandingHero />
  <NuxtImg
    ref="image"
    src="/images/product.png"
    alt="product"
    class="product"
  />
  <section class="h-screen"></section>
</template>

<style scoped lang="postcss">
.product {
  @apply relative left-1/2 -translate-x-1/2 -mt-[15vh];
  @apply rounded-lg;
}
</style>
