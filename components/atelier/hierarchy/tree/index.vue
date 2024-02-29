<template>
  <ul
    class="tree"
    @keydown.esc="useSlidesStore().selectedNode = null"
    @contextmenu.prevent
  >
    <AtelierHierarchyTreeNode name="Page 1" isGroup>
      <AtelierHierarchyTreeNode
        name="Text 1"
        icon="i-carbon-text-short-paragraph"
      />
      <AtelierHierarchyTreeNode name="Group" isGroup>
        <AtelierHierarchyTreeNode
          name="Text 2"
          icon="i-carbon-text-short-paragraph"
        />
      </AtelierHierarchyTreeNode>
    </AtelierHierarchyTreeNode>
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
