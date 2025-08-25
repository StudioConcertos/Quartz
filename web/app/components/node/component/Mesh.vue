<template>
  <NodeComponent name="model">
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
      :disabled="primitiveTypes.includes(props.component.data.type)"
      v-model:value="props.component.data.fallback"
      :options="['none', ...primitiveTypes]"
    />
    <NodeComponentFieldColour
      name="colour"
      v-model:value="props.component.data.colour"
    />
    <NodeComponentFieldSelect
      name="texture"
      v-model:value="props.component.data.texture"
      :options="[
        'default',
        ...useAssetsStore().images.map((image) => image.name),
      ]"
    />
    <NodeComponentFieldNumber
      name="x"
      v-model:value="props.component.data.x"
      :fields="{ label: 'x', value: props.component.data.x }"
    />
    <NodeComponentFieldNumber
      name="y"
      v-model:value="props.component.data.y"
      :fields="{ label: 'y', value: props.component.data.y }"
    />
    <NodeComponentFieldNumber
      name="z"
      v-model:value="props.component.data.z"
      :fields="{ label: 'z', value: props.component.data.z }"
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
