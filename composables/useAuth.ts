export const useAuth = () => {
  const client = useSupabaseClient();

  async function signIn() {
    await client.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/atelier`,
      },
    });
  }

  async function signOut() {
    await client.auth.signOut();

    navigateTo("/", { replace: true });
  }

  return { signIn, signOut };
};
