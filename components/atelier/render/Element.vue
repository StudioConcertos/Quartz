<template>
  <Component
    v-if="render?.element"
    :is="render.element"
    :key="props.node.path"
    :style="[render.style]"
    :id="props.node.id"
    :class="[
      props.node.path === 'root' ? 'root' : 'element',
      selectedNode === props.node ? 'outline-dark-900!' : '',
    ]"
    class="element"
    :tabindex="0"
    @click="selectNode"
    @click.right="cancelSelection"
    @keydown.esc="cancelSelection"
  >
    {{ render.content }}
    <AtelierRenderElement
      v-for="child in props.node.children"
      :key="child.id"
      :node="child"
    />
  </Component>
</template>

<style scoped lang="postcss">
.element {
  @apply absolute transform-origin-top-left whitespace-nowrap;
  @apply outline outline-3 outline-dark-900/0 hover:outline-dark-900;
  @apply border-rd transition-all duration-200;
}
</style>

<script setup lang="ts">
const { renderer, setupCanvas } = useElementRenderer();
const { selectedNode } = storeToRefs(useDeckStore());

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

function selectNode(event: Event) {
  event.stopPropagation();
  selectedNode.value = props.node;
}

function cancelSelection() {
  selectedNode.value = null;
}

onMounted(() => {
  isMounted.value = true;

  if (props.node.type === "webgl_canvas") {
    nextTick(() => {
      setupCanvas(props.node.id);
    });
  }
});
</script>
