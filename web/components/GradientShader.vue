<template>
  <TresCanvas class="gradientShader">
    <TresPerspectiveCamera
      :args="[45, 1, 0.001, 1000]"
      :position="[0, 0, 0.1]"
    />
    <TresMesh>
      <TresPlaneGeometry :args="[1.2, 1.2, 150, 150]" />
      <TresShaderMaterial
        :vertex-shader="vertexShader"
        :fragment-shader="fragmentShader"
        :uniforms="uniforms"
      ></TresShaderMaterial>
    </TresMesh>
  </TresCanvas>
</template>

<script setup lang="ts">
import vertexShader from "~/assets/shaders/hero/vertex.glsl?raw";
import fragmentShader from "~/assets/shaders/hero/fragment.glsl?raw";

import { Color } from "three";

const palette = [new Color(0x6b8a95), new Color(0x3a4a5f), new Color(0x1a2338)];

const uniforms = {
  uTime: { value: Math.random() },
  uColor: { value: palette },
  uGrainSize: { value: 500 },
  uGrainIntensity: { value: 0.1 },
};

const { onLoop } = useRenderLoop();

onLoop(({ delta }) => {
  uniforms.uTime.value += 0.01 * delta;
});
</script>
