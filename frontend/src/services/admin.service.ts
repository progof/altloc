import { z, ZodType } from "zod";
import type { User, PagingObject } from "@shared/index";
import { queryOptions } from "@tanstack/vue-query";
import { FetchError } from "@/utils/fetch";

const errorSchema = z.object({
    errors: z.array(
        z.object({
            message: z.string(),
        })
    ),
});

export const getUsersPageQuerySchema = z.object({
    pageSize: z.coerce.number().int().positive(),
    page: z.coerce.number().int().positive(),
});

export type GetUsersPageQuery = z.infer<typeof getUsersPageQuerySchema>;

// export interface PagingObject<T> {
//     items: T[];
//     totalItems: number;
//     currentPage: number;
//     lastPage: number;
//     pageSize: number;
// }

export const pagingObjectSchema = <T>(
    itemSchema: z.ZodType<T>,
): ZodType<PagingObject<T>> =>
    z.object({
        items: z.array(itemSchema),
        totalItems: z.number().positive(),
        currentPage: z.number().positive(),
        lastPage: z.number().positive(),
        pageSize: z.number().positive(),
    });

// Function for checking if the user is an admin
export const checkAdmin = async (): Promise<User> => {
    const res = await fetch(`/api/auth/admin/`, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        const responseBody = await res.json();
        const errors = errorSchema.parse(responseBody).errors;
        throw new Error(errors.at(0)?.message || "Failed to check admin status");
    }

    const responseData = await res.json();
    return responseData.data as User;
};


export const adminUsersPageQuery = (options?: GetUsersPageQuery) =>
	queryOptions({
		queryKey: options
			? ["api", "admin", "users", "list", options]
			: ["api", "admin", "users", "list"],
		queryFn: async ({ signal }) => {
			const search = options
				? new URLSearchParams({
						page: options.page.toString(),
						pageSize: options.pageSize.toString(),
					}).toString()
				: "";
			const res = await fetch("/api/admin/users?" + search, { signal });
			if (!res.ok) {
				throw new FetchError(res);
			}
            
            const data = await res.json() as Promise<PagingObject<User>>;
            console.log(data);
			return data;
		},
        
	});
