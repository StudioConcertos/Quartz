<template>
  <div class="header">
    <p>Decks:</p>
    <button @click="useDeckStore().insertNewDeck()" class="primaryBtn">
      <div class="i-carbon-add mr-2"></div>
      New Deck
    </button>
  </div>
</template>

<style scoped lang="postcss">
.header {
  @apply bg-dark-500 w-full h-24 p-6 select-none;
  @apply border-solid border-0 border-b-2 border-dark-200;
  @apply flex flex-row justify-between items-center;

  p {
    @apply text-lg font-500;
  }
}
</style>
