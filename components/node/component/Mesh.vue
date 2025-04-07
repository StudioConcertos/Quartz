<template>
  <NodeComponent name="mesh">
    <NodeComponentFieldSelect
      name="type"
      v-model:value="props.component.data.type"
      :options="['box', 'icosahedron', 'triangle', 'sphere']"
    />
    <NodeComponentFieldColour
      name="colour"
      v-model:value="props.component.data.colour"
    />
    <NodeComponentFieldNumber name="x" v-model:value="props.component.data.x" />
    <NodeComponentFieldNumber name="y" v-model:value="props.component.data.y" />
    <NodeComponentFieldNumber name="z" v-model:value="props.component.data.z" />
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
