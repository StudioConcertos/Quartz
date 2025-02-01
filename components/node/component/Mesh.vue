<template>
  <NodeComponent name="mesh">
    <NodeComponentFieldColour
      name="colour"
      v-model:value="props.component.data.colour"
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
