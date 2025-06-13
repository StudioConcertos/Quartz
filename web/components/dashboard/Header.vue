<template>
  <div class="dashboard-header">
    <p>Decks:</p>
    <button @click="useDeckStore().insertNewDeck()" class="primaryButton">
      New Deck
      <div class="i-carbon-add ml-2 mr--2"></div>
    </button>
  </div>
</template>

<style scoped lang="postcss">
.dashboard-header {
  @apply bg-dark-500 w-full h-24 p-6 select-none;
  @apply border-solid border-0 border-b-2 border-dark-200;
  @apply flex flex-row justify-between items-center;

  p {
    @apply text-lg font-500;
  }
}
</style>
