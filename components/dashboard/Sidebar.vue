<template>
  <aside class="sidebar">
    <div class="brand">
      <h1>Quartz<span>v0.0.0</span></h1>
    </div>
  </aside>
</template>

<style scoped lang="postcss">
.sidebar {
  @apply bg-dark-500 w-sm h-screen;
  @apply border-solid border-0 border-r-2 border-dark-200;
  @apply flex flex-col;

  .brand {
    @apply border-solid border-0 border-b-2 border-dark-200;
    @apply h-24 p-6 flex items-center select-none;

    h1 {
      @apply text-2xl font-500;
    }

    span {
      @apply ml-2 text-sm opacity-60;
    }
  }
}
</style>
