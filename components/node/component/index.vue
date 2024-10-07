<template>
  <div class="component">
    <slot />
  </div>
</template>

<style scoped lang="postcss">
.component {
  @apply w-full p-6 bg-dark-900;
  @apply border-solid border-0 border-b-2 border-dark-200;

  .row {
    @apply flex;

    .column {
      @apply flex items-center;

      input {
        @apply p-0 ml-2 w-12 text-center;
      }
    }
  }
}

.component:deep(h4) {
  @apply text-sm font-300 opacity-60;
}

.component:deep(.row) {
  .column {
    @apply flex items-center;

    input {
      @apply p-0 ml-2 w-12 text-center;
    }
  }

  > .column:not(:first-child) {
    @apply ml-6;
  }
}
</style>
