<template>
  <div class="hierarchy" @keydown.esc="useSlidesStore().selectedNode = null">
    <h3>
      Hierarchy
      <div class="actions">
        <button>
          <div class="i-carbon-new-tab"></div>
        </button>
        <button>
          <div class="i-carbon-sort-ascending"></div>
        </button>
      </div>
    </h3>
    <div class="whitespace"></div>
    <AtelierHierarchyTree />
  </div>
</template>

<style scoped lang="postcss">
.hierarchy {
  h3 {
    @apply flex justify-between items-center;

    .actions {
      @apply flex justify-between items-center;

      button {
        @apply text-2xl mx-2;
      }

      button:first-of-type {
        @apply ml-0;
      }

      button:last-of-type {
        @apply mr-0;
      }
    }
  }
}
</style>
