<template>
  <p>Currently signed in as: {{ useAuthStore().user?.email }}</p>
  <p v-if="slides?.length">Slides:</p>
  <div v-for="slide in slides" :key="slide.id">
    <NuxtLink :to="`/atelier/${slide.id}`">{{ slide.id }}</NuxtLink>
  </div>
  <button @click="newSlides()">Create new Slides</button>
  <button @click="useAuth().signOut()">Sign Out</button>
</template>

<script setup lang="ts">
import type { Database } from "~/types/database";

const client = useSupabaseClient<Database>();

const { data: slides } = await useAsyncData(async () => {
  const { data, error } = await client
    .from("slides")
    .select("*")
    .match({ lapidary: useAuthStore().user?.id });

  if (error) console.log(error);

  return data;
});

const newSlides = async () => {
  const { error } = await client.from("slides").insert({
    lapidary: useAuthStore().user?.id,
  });

  if (error) console.log(error);
};

onMounted(() => {
  // Temporary workaround for https://github.com/supabase/gotrue-js/issues/455
  useRouter().replace({ hash: "" });
});
</script>
