<template>
  <div class="timeline">
    <TransitionGroup name="list">
      <AtelierTimelineFrame
        v-for="slide in slides"
        :key="slide.id"
        :index="slide.index"
      />
      <button
        key="new"
        :class="{ 'opacity-100! cursor-not-allowed': isLoading }"
        @click="insertNewSlides"
      >
        <div :class="{ 'animate-spin': isLoading }" class="i-carbon-add" />
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped lang="postcss">
.timeline {
  @apply flex flex-1 scroll-smooth;
  @apply bg-dark-800 w-full p-8;
  @apply overflow-x-auto overflow-y-hidden;
  @apply border-solid border-0 border-t-2 border-dark-200;

  .list-move,
  .list-enter-active,
  .list-leave-active {
    @apply transition-all duration-300;
  }

  .list-enter-from,
  .list-leave-to {
    @apply opacity-0;
    @apply translate-y-10;
  }

  .list-leave-active {
    @apply absolute;
  }

  .frame:not(:last-child) {
    @apply mr-[2.5ch];
  }

  button {
    @apply aspect-video opacity-60 transition-opacity;
    @apply border-1 border-rd border-solid b-light-200;
    @apply flex items-center justify-center min-w-[100px];

    div {
      @apply text-5xl! origin-center;
      @apply animate-duration-1500 animate-delay-600;
    }

    &:hover {
      @apply opacity-100;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
</style>

<script setup lang="ts">
const deckStore = useDeckStore();
const { slides } = storeToRefs(useDeckStore());

const isLoading = ref(false);

async function insertNewSlides() {
  if (isLoading.value) return;

  try {
    isLoading.value = true;

    await deckStore.insertNewSlides(useRoute().params.id.toString());
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 3000);
  }
}
</script>
