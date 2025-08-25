<template>
  <ContentRenderer v-if="page" :value="page" />
</template>

<script setup lang="ts">
const route = useRoute();

const { data: page } = await useAsyncData(`docs-${route.params.slug}`, () => {
  return queryCollection("docs").path(`/docs/${route.params.slug}`).first();
});

if (page.value) {
  useSeoMeta({
    title: `${page.value.title} | Quartz Docs`,
    description: page.value.description,
  });
}
</script>
