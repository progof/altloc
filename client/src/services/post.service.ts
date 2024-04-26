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
  likes: number;
  edit_at: string;
  username: string;
};

export type Comment = {
  comment_id: string;
  post_id: string;
  user_id: string;
  comment: string;
  created_at: string;
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
export const useCreateCommentPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      postId: string;
      comment: string;
    }) => {
      console.log("useCreateCommentPostMutation.data()", data.comment)
      const res = await fetch(`/api/comments/${data.postId}`, {
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
      return res.json() as Promise<{ data: Comment }>;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["comments", res.data.post_id],
        res.data,
      );
      return;
    },
  });
};
// ---------- //
const getCommentsForPost = async (postId: string) => {
  const res = await fetch(`/api/comments/${postId}`, {
    headers: {
      Accept: "application/json",
      method: "GET",
    },
  });

  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }

  const responseData = await res.json();
  return responseData.data as Comment;
};

export const getCommentsForPostQueryOptions = (postId: string) =>
  queryOptions({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsForPost(postId),
  });


// ---------- //
export const useAddSavedPostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      postId: string;
    }) => {
      const res = await fetch(`/api/saved-posts/${data.postId}`, {
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
        queryKey: ["saved-posts/"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["saved-posts/", res.data.post_id],
        res.data,
      );
      return;
    },
  });
};
// ---------- //
// const getSavedListToPost = async () => {
//   const res = await fetch(`/api/saved-posts/`, {
//     headers: {
//       Accept: "application/json",
//       method: "GET",
//     },
//   });

//   if (!res.ok) {
//     const errors = errorSchema.parse(await res.json()).errors;
//     throw new Error(errors.at(0)?.message);
//   }

//   const responseData = await res.json();
//   return responseData.data as Post;
// };

// export const getSavedListToPostQueryOptions = () =>
//   queryOptions({
//     queryKey: ["saved-posts"],
//     queryFn: () => getSavedListToPost,
//   });

  export const getSavedListToPost = async () => {
    const res = await fetch(`/api/saved-posts`, {
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
  
    export const getSavedListToPostQueryOptions = queryOptions({
    queryKey: ["saved-posts"],
    queryFn: getSavedListToPost,
    });


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
export const useLikePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      postId: string;
      likes: number;
    }) => {
      const res = await fetch(`/api/like-post/${data.postId}`, {
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
        queryKey: ["like-post"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["like-post", res.data.post_id],
        res.data,
      );
      return;
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