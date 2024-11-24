<template>
  <Component :is="getElementType(props.node)" :key="props.node.id">
    {{ getNodeContent(props.node) }}
    <AtelierRenderElement
      v-for="child in props.node.children"
      :key="child.id"
      :node="child"
    />
  </Component>
</template>

<script setup lang="ts">
const props = defineProps({
  node: {
    type: Object as PropType<Tree>,
    required: true,
  },
});

function getElementType(node: Tree) {
  return useElementRenderer().handlers[node.type]?.element || "div";
}

function getNodeContent(node: Tree) {
  return useElementRenderer().handlers[node.type]?.render(node) || "";
}
</script>
