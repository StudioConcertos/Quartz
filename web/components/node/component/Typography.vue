<template>
  <NodeComponent name="typography">
    <NodeComponentFieldText
      name="content"
      isParagraph
      v-model:value="props.component.data.content"
    />
    <NodeComponentFieldDropdown
      name="font"
      :options="
        [
          ...fonts,
          ...useAssetsStore().fonts.map((font) => font.name.split('.')[0]),
        ].sort()
      "
      v-model:value="props.component.data.font"
    />
    <NodeComponentFieldNumber
      name="size"
      v-model:value="props.component.data.size"
    />
    <NodeComponentFieldNumber
      name="weight"
      :min="100"
      :max="900"
      :step="100"
      v-model:value="props.component.data.weight"
    />
    <NodeComponentFieldColour
      name="colour"
      v-model:value="props.component.data.colour"
    />
    <NodeComponentFieldRadio
      name="style"
      :options="[
        { value: 'italic', icon: 'i-carbon-text-italic' },
        { value: 'underline', icon: 'i-carbon-text-underline' },
        { value: 'strikethrough', icon: 'i-carbon-text-strikethrough' },
      ]"
      toggleMode
      v-model:value="props.component.data.style"
    />
    <NodeComponentFieldRadio
      name="alignment"
      :options="[
        { value: 'left', icon: 'i-carbon-text-align-left' },
        { value: 'center', icon: 'i-carbon-text-align-center' },
        { value: 'right', icon: 'i-carbon-text-align-right' },
        { value: 'justify', icon: 'i-carbon-text-align-justify' },
      ]"
      v-model:value="props.component.data.alignment"
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
