import { queryOptions, useMutation, useQueryClient } from "@tanstack/vue-query";
import { z } from "zod";
import type { User } from "@shared/index";
import { FetchError } from "@/utils/fetch";

const errorSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    })
  ),
});

export const UpdateCurrentUserBodySchema = z.object({
  username: z.string().min(1).max(255).optional(),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size < 4 * 1024 * 1024, {
      message: "The image is too large, max size is 4 MB",
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "The file must be an image",
    })
    .optional(),
});

const getUser = async (user_id: string) => {
  const res = await fetch(`/api/auth/users/${user_id}/`, {
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

export const getUserQueryOptions = (user_id: string) =>
  queryOptions({
    queryKey: ["/auth/users", user_id],
    queryFn: () => getUser(user_id),
  });

export const getMeQueryOptions = queryOptions({
  queryKey: ["/auth/me"] as const,
  queryFn: async () => {
    const res = await fetch("/api/auth/me");
    if (!res.ok) {
      throw new FetchError(res);
    }
    return (await (res.json() as Promise<{ data: User }>)).data;
  },
});

// export const useUpdateCurrentUserMutation = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (
//       body: (typeof UpdateCurrentUserBodySchema)["_output"]
//     ) => {
//       const formData = new FormData();
//       if (body.username) {
//         formData.append("username", body.username || "");
//       }
//       if (body.avatar) {
//         formData.append("avatar", body.avatar || "");
//       }

//       const res = await fetch("/api/user/update", {
//         method: "PATCH",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new FetchError(res);
//       }

//       return (await res.json()) as User;
//     },
//     onSuccess: (user) => {
//       queryClient.setQueryData(getMeQueryOptions.queryKey, user);
//     },
//   });
// };

export const useUpdateCurrentUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      body: (typeof UpdateCurrentUserBodySchema)["_output"]
    ) => {
      // Создаём FormData и добавляем поля, только если они определены
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      const res = await fetch("/api/user/update", {
        method: "PATCH",
        body: formData,
      });

      // Обрабатываем ошибки запроса
      if (!res.ok) {
        throw new FetchError(res);
      }

      // Возвращаем данные в ожидаемом формате
      return (await res.json()) as User;
    },
    onSuccess: (user) => {
      // Обновляем данные пользователя в кэше
      queryClient.setQueryData(getMeQueryOptions.queryKey, user);
    },
  });
};
