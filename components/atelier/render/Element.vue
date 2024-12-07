<template>
  <Component
    :is="render.element"
    :key="props.node.id"
    :style="[
      render.style,
      {
        position: 'absolute',
        transformOrigin: 'left',
      },
    ]"
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

const props = defineProps({
  node: {
    type: Object as PropType<Tree>,
    required: true,
  },
});

const render = computed(() => {
  const result = renderer[props.node.type];

  return {
    element: result.element,
    ...result.render(props.node),
  };
});
</script>
