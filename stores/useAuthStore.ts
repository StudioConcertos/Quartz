export const useAuthStore = defineStore("auth", () => {
  const client = useSupabaseClient();

  const user = ref(useSupabaseUser().value);
  const isSignedIn = ref(user.value ? true : false);

  client.auth.onAuthStateChange((event, session) => {
    user.value = session ? session.user : null;
  });

  return { user, isSignedIn };
});
