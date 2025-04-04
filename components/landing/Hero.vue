<template>
  <div class="hero">
    <GradientShader />
    <div class="info">
      <div class="whitespace"></div>
      <div class="mb-12 md:mb-18">
        <h1>Pitch ambitiously</h1>
        <div class="whitespace"></div>
        <p>
          Quartz is a open source
          <span class="font-bold italic">slides engine</span>; built for
          ambitious presentations.
        </p>
        <p>Currently in heavy development.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-6 md:gap-12 justify-center">
        <NuxtLink to="/auth" class="primaryButton text-2xl"
          >Get Started</NuxtLink
        >
        <NuxtLink
          to="https://github.com/StudioConcertos/Quartz"
          target="_blank"
          class="primaryButton text-2xl"
          >Learn More</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.hero {
  @apply flex relative h-[90vh];

  .info {
    @apply absolute opacity-80 select-none;
    @apply top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
    @apply w-full text-center px-6;

    h1 {
      @apply text-5xl md:text-6xl lg:text-8xl;
    }

    p {
      @apply text-sm md:text-lg;
    }

    a {
      @apply text-sm md:text-xl;
    }
  }
}
</style>
