<template>
  <p>{{ useAuthStore().user }}</p>
  <p>{{ useAuthStore().isSignedIn }}</p>
  <button @click="useAuth().signOut()">Sign Out</button>
</template>

<script setup lang="ts">
onMounted(() => {
  // Temporary workaround for https://github.com/supabase/gotrue-js/issues/455
  useRouter().replace({ hash: "" });
});
</script>
