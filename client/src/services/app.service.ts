import { queryOptions, useMutation } from "@tanstack/vue-query";
import { z } from "zod";

const errorSchema = z.object({
	errors: z.array(
		z.object({
			message: z.string(),
		})
	),
});

export type Note = {
    note_id: string,
    user_id: string,
    note_title: string,
    note_description: string,
    note_body: string,
    note_category: string,
    created_at: string,
};

export const useNoteCreateMutation = () =>
	useMutation({
		mutationFn: async (data: {
			user_id: string;
		    note_title: string;
		    note_description: string;
		    note_body: string;
            note_category: string;
		}) => {
			const res = await fetch("/api/app/create-new-note", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const errors = errorSchema.parse(await res.json()).errors;
				throw new Error(errors.at(0)?.message);
			}
			return;
		},
	});

    export const getNoteQueryOptions = queryOptions({
        queryKey: ["/app/get-note"],
        queryFn: async () => {
            const res = await fetch("/api/app/get-note");
            if (!res.ok) {
                const errors = errorSchema.parse(await res.json()).errors;
                throw new Error(errors.at(0)?.message);
            }
            return (await (res.json() as Promise<{ data: Note[] }>)).data;
        },
    });

    export const useNoteDeleteMutation = () =>
	useMutation({
		mutationFn: async (data: {
			note_id: string;
		}) => {
			const res = await fetch("/api/app/delete-note", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) {
				const errors = errorSchema.parse(await res.json()).errors;
				throw new Error(errors.at(0)?.message);
			}
			return;
		},
	});

//     export const useGetNoteByIdMutation = () =>
//   useMutation({
//     mutationFn: async (data: { note_id: string }) => {
//       try {
//         console.log("Sending request to server with data:", data);
//         const res = await fetch("/api/app/get-note-id", {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data),
//         });

//         if (!res.ok) {
//           const errors = errorSchema.parse(await res.json()).errors;
//           throw new Error(errors.at(0)?.message);
//         }
        
//         const responseData = await res.json();
//         console.log("Response from server:", responseData);
//         return responseData.data as Note[];
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         throw new Error("Error fetching data");
//       }
//     },
//   });
 
export const useGetNoteByIdMutation = () =>
  useMutation({
    mutationFn: async (data: { note_id: string }) => {
      try {
        console.log("Sending request to server with data:", data);
        const res = await fetch("/api/app/get-note-id", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errors = errorSchema.parse(await res.json()).errors;
          throw new Error(errors.at(0)?.message);
        }

        const responseData = await res.json();
        console.log("Response from server:", responseData);

        if (responseData && responseData.data) {
          return responseData.data as Note[];
        } else {
          console.error("Unexpected response format from the server.");
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Error fetching data");
      }
    },
  });
