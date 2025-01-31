<template>
  <Component
    v-if="render?.element"
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
    :id="props.node.id"
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
const { renderer, animate, setupCanvas } = useElementRenderer();

const props = defineProps<{
  node: Tree;
}>();

const isMounted = ref(false);

const render = computed(() => {
  if (!isMounted.value) return;

  console.log("Rendering", props.node.type);

  const result = renderer[props.node.type];

  return {
    element: result.element,
    ...result.render(props.node),
  };
});

onMounted(() => {
  isMounted.value = true;

  if (props.node.type === "webgl_canvas") {
    nextTick(() => {
      setupCanvas();
      animate();
    });
  }
});
</script>
