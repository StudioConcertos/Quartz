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
    ref="element"
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
  @apply absolute transform-origin-top-left;
  @apply outline outline-3 outline-dark-900/0 hover:outline-dark-900;
  @apply border-rd whitespace-nowrap;
}
</style>

<script setup lang="ts">
const { renderer, setupCanvas } = useElementRenderer();
const { selectedNode, currentComponents } = storeToRefs(useDeckStore());

const element = useTemplateRef<HTMLElement>("element");

const props = defineProps<{
  node: Tree;
}>();

const isMounted = ref(false);

const { x, y } = useDraggable(element);

const startTransform = ref<{ x: number; y: number } | null>(null);
const startDrag = ref<{ x: number; y: number } | null>(null);

const throttle = computed(() => {
  return Math.round(1000 / useFps().value);
});

watchThrottled(
  [x, y],
  ([newX, newY]) => {
    const transform = getTransformComponent();

    if (!transform) return;

    if (!startTransform.value || !startDrag.value) {
      startTransform.value = { x: transform.data.x, y: transform.data.y };
      startDrag.value = { x: newX, y: newY };

      return;
    }

    const deltaX = newX - startDrag.value.x;
    const deltaY = newY - startDrag.value.y;

    const scaleX = 1920 / (element.value?.parentElement?.clientWidth || 1920);
    const scaleY = 1080 / (element.value?.parentElement?.clientHeight || 1080);

    transform.data.x = Math.round(startTransform.value.x + deltaX * scaleX);
    transform.data.y = Math.round(startTransform.value.y + deltaY * scaleY);
  },
  { throttle }
);

watchEffect(() => {
  if (x.value === 0 && y.value === 0) {
    startTransform.value = null;
    startDrag.value = null;
  }
});

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

function getTransformComponent() {
  return currentComponents.value.find(
    (component) =>
      component.type === "transform" && component.node === props.node.id
  );
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
