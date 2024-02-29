<template>
  <Title>Auth | Quartz</Title>
  <div class="auth">
    <h2>Authenticate</h2>
    <div class="whitespace"></div>
    <button @click="useAuth().signIn()">
      Sign In with Github
      <div class="i-carbon-logo-github"></div>
    </button>
  </div>
</template>

<style scoped lang="postcss">
.auth {
  @apply flex flex-col h-screen;
  @apply justify-center items-center;

  button {
    @apply flex items-center;
    @apply border-solid border-1 border-light-200 border-rd;
    @apply px-4 py-2 transition-colors;
    @apply hover-bg-light-200 hover-text-dark-800;

    [class*="i-"] {
      @apply text-2xl ml-2;
    }
  }
}
</style>
