<template>
  <div class="hero">
    <GradientShader />
    <h2 class="title">quartz.graphics</h2>
  </div>
</template>

<style scoped lang="postcss">
.hero {
  @apply flex relative h-[80vh];

  .title {
    @apply self-end w-screen absolute z-1;
    @apply text-[10vw]! text-center;
    @apply font-300 line-height-normal;
    @apply select-none;
  }
}
</style>
