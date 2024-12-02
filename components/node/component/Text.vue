<template>
  <NodeComponent name="text">
    <div class="field">
      <label>content</label>
      <textarea
        @keydown.enter.exact.prevent="handleEnter"
        v-model.lazy="props.component.data.content"
        rows="5"
      />
    </div>
    <div class="field">
      <label>size(px)</label>
      <input type="number" v-model.lazy="props.component.data.size" />
    </div>
    <div class="field">
      <label>weight</label>
      <input type="number" v-model.lazy="props.component.data.weight" />
    </div>
  </NodeComponent>
</template>

<script setup lang="ts">
const { updateNodeComponent } = useDeckStore();

const props = defineProps<{
  component: ComponentModel;
}>();

watch(props.component.data, () => {
  updateNodeComponent(props.component);
});

function handleEnter(event: KeyboardEvent) {
  (event.target as HTMLTextAreaElement).blur();
}
</script>
