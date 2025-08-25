<template>
  <NodeComponent name="camera">
    <NodeComponentFieldNumber
      name="x"
      v-model:value="component.data.x"
      :fields="{ label: 'x', value: component.data.x }"
    />
    <NodeComponentFieldNumber
      name="y"
      v-model:value="component.data.y"
      :fields="{ label: 'y', value: component.data.y }"
    />
    <NodeComponentFieldNumber
      name="z"
      v-model:value="component.data.z"
      :fields="{ label: 'z', value: component.data.z }"
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
