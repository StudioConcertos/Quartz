<template>
  <NodeComponent name="scene">
    <NodeComponentFieldColour
      name="background"
      v-model:value="props.component.data.background"
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
