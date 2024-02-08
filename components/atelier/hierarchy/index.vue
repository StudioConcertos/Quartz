<template>
  <div class="hierarchy">
    <h3>Hierarchy</h3>
    <div class="whitespace"></div>
    <ul class="tree">
      <li v-for="i in 25" class="node">
        <button @click="">
          <div class="i-carbon-caret-right"></div>
          <p>Example {{ i }}</p>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="postcss">
.hierarchy .tree {
  /*
    By setting the max height to the half of the screen's,
    it prevents the tree to overflow,
    and also makes it responsive to different screen heights.

    (100vh / Number of elements inside the inspector)
  */
  @apply list-none h-full max-h-[50vh] overflow-y-auto;

  .node button {
    @apply flex text-sm items-center p-2;
    @apply w-full transition-colors border-rd;
    @apply hover-bg-light-200 hover-text-dark-500;

    [class*="i-"] {
      @apply text-xl mr-2;
    }
  }
}
</style>
