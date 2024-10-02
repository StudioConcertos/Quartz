<template>
  <Title>Auth | Quartz</Title>
  <div class="auth">
    <h2>Authenticate</h2>
    <div class="whitespace"></div>
    <button class="primaryButton" @click="useAuthStore().signIn()">
      Sign In with Github
      <div class="i-carbon-logo-github ml-2"></div>
    </button>
  </div>
</template>

<style scoped lang="postcss">
.auth {
  @apply flex flex-col h-screen;
  @apply justify-center items-center;
}
</style>
