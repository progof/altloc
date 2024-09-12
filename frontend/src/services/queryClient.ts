import { QueryClient } from "@tanstack/vue-query";

const isProduction = import.meta.env.PROD;

export const queryClient = new QueryClient({
	defaultOptions: {
		mutations: {
			retry: false,
		},
		queries: {
			retry: (failureCount ) => {
				// don't retry in development
				if (!isProduction) {
					return false;
				}
				
				if (failureCount > 1) {
					return false;
				}
				return true;
			},
			refetchOnMount: isProduction,
			refetchOnWindowFocus: isProduction,

		},
     
	},
});