import { z } from "zod";
import type { User } from "@shared/index";

const errorSchema = z.object({
	errors: z.array(
		z.object({
			message: z.string(),
		})
	),
});


// function for checking if the user is an admin

export const checkAdmin = async () => {
    const res = await fetch(`/api/auth/admin/`, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        const errors = errorSchema.parse(await res.json()).errors;
        throw new Error(errors.at(0)?.message);
    }

    const responseData = await res.json();
    return responseData.data as User;
};