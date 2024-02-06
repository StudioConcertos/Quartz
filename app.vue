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

a,
button {
  @apply bg-transparent decoration-none border-none;
  @apply text-light-200 cursor-pointer;
}

main {
  @apply bg-dark-800 text-light-200 h-screen;
}

.whitespace {
  @apply my-6;
}
</style>
