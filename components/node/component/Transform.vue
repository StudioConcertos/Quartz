<template>
  <NodeComponent name="transform">
    <div class="field">
      <label>x:</label>
      <input type="number" step="0.01" v-model.lazy="props.component.data.x" />
    </div>
    <div class="field">
      <label>y:</label>
      <input type="number" step="0.01" v-model.lazy="props.component.data.y" />
    </div>
    <div class="field">
      <label>z:</label>
      <input type="number" step="0.01" v-model.lazy="props.component.data.z" />
    </div>
    <div class="field">
      <label>scale:</label>
      <input
        type="number"
        step="0.01"
        v-model.lazy="props.component.data.scale"
      />
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
</script>
