<template>
  <p>{{ useAuthStore().user }}</p>
  <p>{{ useAuthStore().isSignedIn }}</p>
  <button @click="useAuth().signOut()">Sign Out</button>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>
