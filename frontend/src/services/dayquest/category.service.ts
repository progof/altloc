import { useMutation, queryOptions} from "@tanstack/vue-query";
import { z } from "zod";
import { FetchError } from "@/utils/fetch";
// import { objectToFromData } from "@/utils/formData";
// import { dateToUTCTimestamp } from "@/utils/date";
import { Category } from "shared";




// const createCategoryBodyWithoutImageSchema = z
// 	.object({
// 		name: z.string().min(6).max(256),
// 		taskIds: z
// 			.array(z.string().uuid())
// 			.min(1)
// 			.or(
// 				z
// 					.string()
// 					.uuid()
// 					.transform((id) => [id]),
// 			),
	
// 	});

// export const createCategoryBodySchema =
// createCategoryBodyWithoutImageSchema.and(
// 		z.object({
// 			image: z
// 				.instanceof(File)
// 				.refine((file) => file.size < 5 * 1024 * 1024, {
// 					message: "The image is too large, max size is 5 MB",
// 				})
// 				.refine((file) => file.type.startsWith("image/"), {
// 					message: "The file must be an image",
// 				}),
// 		}),
// 	);

// export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;


const createCategoryBodySchema = z
	.object({
		name: z.string().min(6).max(256),
		taskIds: z
			.array(z.string().uuid())
			.min(1)
			.or(
				z
					.string()
					.uuid()
					.transform((id) => [id]),
			),
	});

export type CreateCategoryBody = z.infer<typeof createCategoryBodySchema>;



// export function useCreateCategoryMutation() {
// 	return useMutation({
// 		mutationFn: async (body: CreateCategoryBody) => {
// 			const formData = objectToFromData(
// 				Object.fromEntries(
// 					Object.entries(body).map(([key, value]) => {
// 						if (value instanceof Date) {
// 							return [key, dateToUTCTimestamp(value)];
// 						}
// 						return [key, value];
// 					}),
// 				),
// 			);

// 			const res = await fetch("/api/dayquest/category/create", {
// 				method: "POST",

// 				body: formData,
			
// 			});

// 			if (!res.ok) {
// 				throw new FetchError(res);
// 			}

// 			return res.json();
// 		},
// 	});
// }


// write useCreateCategoryMutation with headers: {'Content-Type': 'application/json',}, body: JSON.stringify(body),  // Отправка данных в формате JSON


export function useCreateCategoryMutation() {
	return useMutation({
		mutationFn: async (body: CreateCategoryBody) => {
			const res = await fetch("/api/dayquest/category/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				throw new FetchError(res);
			}

			return res.json();
		},
	});
}


export const categoriesQuery = queryOptions({
	queryKey: ["api", "dayquest", "categories"],
	queryFn: async ({ signal }) => {
		const res = await fetch("/api/dayquest/categories", { signal });

		if (!res.ok) {
			throw new FetchError(res);
		}

		return res.json() as Promise<Category[]>;
	},
});