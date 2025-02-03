<template>
  <NodeComponent name="transform">
    <NodeComponentFieldNumber name="x" v-model:value="props.component.data.x" />
    <NodeComponentFieldNumber name="y" v-model:value="props.component.data.y" />
    <NodeComponentFieldNumber name="z" v-model:value="props.component.data.z" />
    <NodeComponentFieldNumber
      name="width"
      v-model:value="props.component.data.width"
    />
    <NodeComponentFieldNumber
      name="height"
      v-model:value="props.component.data.height"
    />
    <NodeComponentFieldNumber
      name="scale"
      :min="0.01"
      :step="0.01"
      v-model:value="props.component.data.scale"
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
