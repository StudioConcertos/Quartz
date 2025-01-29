<template>
  <Component
    :is="render.element"
    :key="props.node.path"
    :style="[
      render.style,
      {
        position: 'absolute',
        transformOrigin: 'top left',
        whiteSpace: 'nowrap',
        cursor: 'move',
      },
    ]"
    :id="props.node.path"
    :class="props.node.path === 'root' ? 'root' : 'element'"
  >
    {{ render.content }}
    <AtelierRenderElement
      v-for="child in props.node.children"
      :key="child.id"
      :node="child"
    />
  </Component>
</template>

<script setup lang="ts">
const { renderer } = useElementRenderer();

const props = defineProps<{
  node: Tree;
}>();

const render = computed(() => {
  const result = renderer[props.node.type];

  return {
    element: result.element,
    ...result.render(props.node),
  };
});
</script>
