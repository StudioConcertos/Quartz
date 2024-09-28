<template>
  <div class="hero">
    <TresCanvas>
      <TresPerspectiveCamera
        :args="[45, 1, 0.001, 1000]"
        :position="[0, 0, 0.1]"
      />
      <TresMesh>
        <TresPlaneGeometry :args="[1.5, 1.5, 100, 100]" />
        <TresShaderMaterial
          :vertex-shader="vertexShader"
          :fragment-shader="fragmentShader"
          :uniforms="uniforms"
        ></TresShaderMaterial>
      </TresMesh>
    </TresCanvas>
    <h2 class="title">quartz.graphics</h2>
  </div>
</template>

<style scoped lang="postcss">
.hero {
  @apply flex relative h-[80vh];

  .title {
    @apply self-end w-screen absolute z-1;
    @apply text-[10vw]! text-center;
    @apply font-300 line-height-normal;
    @apply select-none;
  }
}
</style>

<script setup lang="ts">
import vertexShader from "~/assets/shaders/hero/vertex.glsl?raw";
import fragmentShader from "~/assets/shaders/hero/fragment.glsl?raw";

import { useRenderLoop } from "@tresjs/core";

import { Color } from "three";

const palette = [
  new Color(0xd27685),
  new Color(0x9e4784),
  new Color(0xf5f5f5),
  new Color(0x37306b),
];

const uniforms = {
  uTime: { value: 0 },
  uColor: { value: palette },
};

const { onLoop } = useRenderLoop();

onMounted(async () => {
  uniforms.uTime.value = Math.random();

  await nextTick();

  onLoop(() => {
    uniforms.uTime.value += 0.0001;
  });
});
</script>
