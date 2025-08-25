<template>
  <ContentRenderer v-if="page" :value="page" />
  <template v-else>
    <div class="w-screen h-screen flex flex-col items-center justify-center">
      <h1>Page Not Found</h1>
      <p>Oops! The content you're looking for doesn't exist.</p>
      <NuxtLink to="/">Go back home</NuxtLink>
    </div>
  </template>
</template>

<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(`docs-${route.params.slug}`, () => {
  return queryCollection("docs").path(`/docs/${route.params.slug}`).first();
});
</script>
