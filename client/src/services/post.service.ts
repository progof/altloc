import { queryOptions, useMutation, useQueryClient } from "@tanstack/vue-query";
import { z } from "zod";

const errorSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    }),
  ),
});

export type Post = {
  post_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  edit_at: string;
  username: string;
};

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      content: string;
    }) => {
      console.log("useCreatePostMutation.data()", data.content, data.title)
      const res = await fetch("/api/posts", {
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
      return res.json() as Promise<{ data: Post }>;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["posts", res.data.post_id],
        res.data,
      );
      return;
    },
  });
};

// ---------- //
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      postId: string;
      userId: string;
      title: string;
      content: string;
    }) => {
      const res = await fetch(`/api/posts/${data.userId}/${data.postId}`, {
        method: "PATCH",
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
      return res.json() as Promise<{ data: Post }>;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["posts", res.data.post_id],
        res.data,
      );
      return;
    },
  });
};

// ---------- //
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      postId: string;
    }) => {
      const res = await fetch(`/api/posts/${data.postId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errors = errorSchema.parse(await res.json()).errors;
        throw new Error(errors.at(0)?.message);
      }
      return;
    },
    onSuccess: (_res, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
        type: "active",
      });
      queryClient.removeQueries({
        queryKey: ["posts", postId],
        exact: true,
      });
    },
  });
};

// ---------- //
const getPost = async (postId: string) => {
  const res = await fetch(`/api/posts/${postId}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }

  const responseData = await res.json();
  return responseData.data as Post;
};

export const getPostQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["posts", postId],
    queryFn: () => getPost(postId),
  });

// ---------- //
export const getPosts = async () => {
  const res = await fetch(`/api/posts`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }

  return (await res.json() as { data: Post[] }).data;
};

export const getPostsQueryOptions = queryOptions({
  queryKey: ["posts"],
  queryFn: getPosts,
});

// ---------- //
export const getAllPosts = async () => {
	const res = await fetch(`/api/all-posts`, {
	  headers: {
		Accept: "application/json",
	  },
	});
  
	if (!res.ok) {
	  const errors = errorSchema.parse(await res.json()).errors;
	  throw new Error(errors.at(0)?.message);
	}
  
	return (await res.json() as { data: Post[] }).data;
  };

  export const getAllPostsQueryOptions = queryOptions({
	queryKey: ["all-posts"],
	queryFn: getAllPosts,
  });

// ---------- //
  const getCountPosts = async (userId: string) => {
    const res = await fetch(`/api/count-posts/${userId}`, {
      headers: {
        Accept: "application/json",
      },
    });
  
    if (!res.ok) {
      const errors = errorSchema.parse(await res.json()).errors;
      throw new Error(errors.at(0)?.message);
    }
  
    const responseData = await res.json();
    console.log("getCountPosts:", responseData);
    return responseData.data as { CountPost: number };
  };
  
  export const getCountPostsQueryOptions = (userId: string) =>
    queryOptions({
      queryKey: ["count-posts", userId],
      queryFn: () => getCountPosts(userId),
    });

// ---------- //
const getPostsForUser = async (userId: string) => {
  const res = await fetch(`/api/user-posts/${userId}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }

  const responseData = await res.json();
  return responseData.data as Post;
};

export const getPostsForUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-posts", userId],
    queryFn: () => getPostsForUser(userId),
  });

// ---------- //
  const getUser = async (userId: string) => {
    const res = await fetch(`/api/users/${userId}`, {
      headers: {
        Accept: "application/json",
      },
    });
  
    if (!res.ok) {
      const errors = errorSchema.parse(await res.json()).errors;
      throw new Error(errors.at(0)?.message);
    }
  
    const responseData = await res.json();
    return responseData.data as Post;
  };
  
  export const getUserQueryOptions = (userId: string) =>
    queryOptions({
      queryKey: ["users", userId],
      queryFn: () => getUser(userId),
    });