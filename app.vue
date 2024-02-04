<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="postcss">
::selection {
  @apply bg-light-200 text-dark-800;
}

* {
  @apply m-0 p-0 box-border;
  @apply font-sans outline-none;
}

a {
  @apply decoration-none text-light-200;
}

main {
  @apply bg-dark-800 text-light-200 h-screen;
}
</style>
