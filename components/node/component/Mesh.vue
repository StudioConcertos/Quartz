<template>
  <NodeComponent name="mesh">
    <NodeComponentFieldSelect
      name="type"
      v-model:value="props.component.data.type"
      :options="[
        ...primitiveTypes,
        ...useAssetsStore().models.map((model) => model.name),
      ]"
    />
    <NodeComponentFieldSelect
      name="fallback"
      v-model:value="props.component.data.fallback"
      :options="['none', ...primitiveTypes]"
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
