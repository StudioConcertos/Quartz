<template>
  <aside class="sidebar">
    <h3>Dashboard</h3>
    <div class="whitespace"></div>
    <p class="mb-6">Currently logged in as: {{ useAuthStore().user?.email }}</p>
    <button @click="useAuth().signOut()" class="primaryBtn">Sign out</button>
  </aside>
</template>

<style scoped lang="postcss">
.sidebar {
  @apply bg-dark-500 w-sm h-screen;
  @apply border-solid border-0 border-r-2 border-dark-200;
  @apply flex flex-col p-[2.5ch];
}
</style>
