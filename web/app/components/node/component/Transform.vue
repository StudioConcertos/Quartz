<template>
  <NodeComponent name="transform">
    <NodeComponentFieldNumber
      name="position"
      :fields="[
        { label: 'x', value: props.component.data.position.x },
        { label: 'y', value: props.component.data.position.y },
        { label: 'z', value: props.component.data.position.z },
      ]"
      @update:value="
        (label, value) => (props.component.data.position[label] = value)
      "
    />
    <NodeComponentFieldNumber
      name="width"
      v-model:value="props.component.data.width"
      :fields="{ label: 'width', value: props.component.data.width }"
    />
    <NodeComponentFieldNumber
      name="height"
      v-model:value="props.component.data.height"
      :fields="{ label: 'height', value: props.component.data.height }"
    />
    <NodeComponentFieldNumber
      name="scale"
      v-model:value="props.component.data.scale"
      :fields="{ label: 'scale', value: props.component.data.scale }"
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
