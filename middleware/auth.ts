export default defineNuxtRouteMiddleware((to, from) => {
  if (!useAuthStore().isSignedIn) return navigateTo("/", { replace: true });
});
