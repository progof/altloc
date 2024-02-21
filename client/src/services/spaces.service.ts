import { queryOptions, useMutation, useQueryClient } from "@tanstack/vue-query";
import { z } from "zod";

const errorSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    }),
  ),
});

export type Space = {
  space_id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  edit_at: string;
  username: string;
};

export const useCreateSpaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category: string;
    }) => {
      const res = await fetch("/api/spaces", {
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
      return res.json() as Promise<{ data: Space }>;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["spaces"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["spaces", res.data.space_id],
        res.data,
      );
      return;
    },
  });
};
