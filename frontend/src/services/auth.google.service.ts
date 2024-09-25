import { ref } from 'vue';

export function useGoogleAuth() {
  const isLoading = ref(false);
  const isError = ref(false);
  const error = ref<string | null>(null);

  const redirectToGoogle = async () => {
    isLoading.value = true;
    isError.value = false;
    error.value = null;

    try {
      const response = await fetch("/api/auth/google", {
        method: 'GET', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = `Failed to initiate Google auth: ${response.status} ${response.statusText}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (!data.redirectUrl) {
        const errorMessage = 'Invalid response from server: missing redirectUrl';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      window.location.href = data.redirectUrl; 

    } catch (err) {
      isError.value = true;
      error.value = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Failed to initiate Google auth:', error.value);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    redirectToGoogle,
    isLoading,
    isError,
    error,
  };
}
