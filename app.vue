<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="postcss">
::selection {
  @apply bg-light-200 text-dark-900;
}

* {
  @apply m-0 p-0 box-border;
  @apply font-sans outline-none;
}

a,
button {
  @apply bg-transparent decoration-none border-none;
  @apply text-light-200 cursor-pointer select-none;
}

dialog {
  @apply absolute top-1/2 left-1/2 px-8 py-12;
  @apply translate-x-[-50%] translate-y-[-50%];
  @apply border-2 border-dark-200 border-rd;
  @apply bg-dark-900 text-light-200 select-none;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.6);
}

input,
textarea {
  @apply bg-transparent border-none transition-colors;
  @apply text-light-200 py-4 text-sm;
  @apply border-solid border-0 border-b-1;
}

form {
  @apply flex flex-col;

  > * {
    @apply my-2;
  }

  > *:first-child {
    @apply mt-0;
  }
}

main {
  @apply bg-dark-900 text-light-200 h-screen;
  @apply overflow-x-hidden;
}

section {
  @apply h-screen;
}

select {
  @apply bg-transparent text-light-200;
  @apply border-0! border-b-1! border-light-200;
  @apply text-sm py-4 cursor-pointer;

  option {
    @apply bg-dark-500 text-light-200;
  }
}

textarea {
  @apply resize-none;
}

.disabled {
  @apply opacity-50 pointer-events-none transition-opacity;
}

.fade-enter-from {
  @apply opacity-0;
}

.fade-enter-to {
  @apply opacity-100;
}

.fade-enter-active {
  @apply transition-opacity;
}

.primaryButton {
  @apply flex justify-center items-center;
  @apply border-solid border-1 border-light-200 border-rd;
  @apply px-4 py-2 transition-all;
  @apply hover-bg-light-200 hover-text-dark-900;

  [class*="i-"] {
    @apply text-2xl;
  }
}

.sortable-ghost {
  @apply opacity-0;
}

.whitespace {
  @apply my-6;
}
</style>
