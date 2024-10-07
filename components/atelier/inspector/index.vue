<template>
  <div class="inspector">
    <h3>
      Inspector
      <div class="actions">
        <Tooltip description="New component">
          <button @click="">
            <div class="i-carbon-new-tab"></div>
          </button>
        </Tooltip>
      </div>
    </h3>
    <div class="whitespace"></div>
    <AtelierInspectorView />
  </div>
</template>

<style scoped lang="postcss">
.inspector {
  h3 {
    @apply flex justify-between items-center;

    .actions {
      @apply flex justify-between items-center;

      .tooltip {
        @apply flex mx-2;

        button {
          @apply text-xl;
        }
      }

      .tooltip:first-of-type {
        @apply ml-0;
      }

      .tooltip:last-of-type {
        @apply mr-0;
      }
    }
  }
}
</style>
