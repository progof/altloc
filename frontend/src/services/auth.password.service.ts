import { useMutation } from "@tanstack/vue-query";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth.store";
import { pinia } from "@/stores/pinia";

const authStore = useAuthStore(pinia);
export const isAuthenticated = authStore.isAuthenticated;

const errorSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    })
  ),
});

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: async (data: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const res = await fetch("/api/auth/signup", {
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

// export const useLoginMutation = () =>
//   useMutation({
//     mutationFn: async (data: { email: string; password: string }) => {
//       const res = await fetch("/api/auth/password/login", {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!res.ok) {
//         const errors = errorSchema.parse(await res.json()).errors;
//         throw new Error(errors.at(0)?.message);
//       }
//       //Обновляем статус аутентификации через Pinia
//       authStore.isAuthenticated = true;
//       localStorage.setItem("isAuthenticated", "true");
//       console.log("login pinia", authStore.isAuthenticated);
//       console.log(await res.json());
//       return;
//     },
//   });

export const useLoginMutation = () =>
  useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch("/api/auth/password/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Проверка на ошибки HTTP
      if (!res.ok) {
        const text = await res.text(); // Читаем текст ответа
        let errorMessage = "Unknown error"; // Сообщение об ошибке по умолчанию
        try {
          const errorData = JSON.parse(text);
          // Пробуем распарсить ошибку, если она есть
          errorMessage = errorData.errors?.at(0)?.message || errorMessage;
        } catch (err) {
          // Если не получилось распарсить, выводим общий текст ошибки
          errorMessage = "Failed to parse error response";
        }
        throw new Error(errorMessage); // Бросаем ошибку с сообщением
      }

      // Если ответ успешен, обрабатываем его
      const text = await res.text();
      let responseData;
      try {
        responseData = text ? JSON.parse(text) : {}; // Парсим только если не пусто
      } catch (err) {
        throw new Error("Invalid JSON response from server");
      }

      // Обновляем статус аутентификации через Pinia
      authStore.isAuthenticated = true;
      localStorage.setItem("isAuthenticated", "true");
      console.log("login pinia", authStore.isAuthenticated);
      console.log("Response data:", responseData);

      return responseData; // Вернуть данные из ответа
    },
  });

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/password/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errors = errorSchema.parse(await res.json()).errors;
        throw new Error(errors.at(0)?.message);
      }
      // Обновляем статус аутентификации через Pinia
      // authStore.isAuthenticated = false;
      // localStorage.setItem("isAuthenticated", "false");
      // console.log("logout pinia", authStore.isAuthenticated);
      return;
    },
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: { user_id: string; activation_token: string }) => {
      const res = await fetch(
        `/api/auth/password/verify-email/${data.user_id}/${data.activation_token}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return;
    },
  });
};

export const useRecoveryPasswordMutation = () =>
  useMutation({
    mutationFn: async (data: { email: string }) => {
      const res = await fetch("/api/auth/password/recovery_password", {
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

export const useResetPasswordEmailMutation = () => {
  return useMutation({
    mutationFn: async (data: {
      user_id: string;
      reset_token: string;
      password: string;
    }) => {
      const res = await fetch(
        `/api/auth/password/email-reset-password/${data.user_id}/${data.reset_token}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) {
        throw new Error(await res.text());
      }
      return;
    },
  });
};
