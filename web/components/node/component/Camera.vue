<template>
  <NodeComponent name="camera">
    <NodeComponentFieldNumber
      name="x"
      :step="0.1"
      v-model:value="component.data.x"
    />
    <NodeComponentFieldNumber
      name="y"
      :step="0.1"
      v-model:value="component.data.y"
    />
    <NodeComponentFieldNumber
      name="z"
      :step="0.1"
      v-model:value="component.data.z"
    />
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
