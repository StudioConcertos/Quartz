<template>
  <div class="assets">
    <h3>
      Assets
      <div class="actions">
        <Tooltip description="Upload new asset">
          <button @click="">
            <div class="i-carbon-cloud-upload"></div>
          </button>
        </Tooltip>
      </div>
    </h3>
    <div class="whitespace"></div>
  </div>
</template>

<style scoped lang="postcss">
.assets {
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

<script setup lang="ts"></script>
