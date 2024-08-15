<template>
  <ul class="tree">
    <AtelierHierarchyTreeNode
      :name="`${undefined}` + ' ' + `${useDeckStore().selectedSlidesIndex + 1}`"
      isGroup
    />
  </ul>
</template>

<style scoped lang="postcss">
.tree {
  /*
    By setting the max height to the half of the screen's,
    it prevents the tree to overflow,
    and also makes it responsive to different screen heights.

    (100vh / Number of elements inside the inspector)
  */
  @apply list-none h-full max-h-[50vh] overflow-y-auto;
}
</style>

<script setup lang="ts">
console.log(useDeckStore().selectedSlides);
</script>
