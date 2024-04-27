import { queryOptions, useMutation, useQueryClient } from "@tanstack/vue-query";
import { z } from "zod";

const errorSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    }),
  ),
});

export type Note = {
  note_id: string;
  space_id: string;
  user_id: string;
  title: string;
  description: string;
  body: string;
  category: string;
  created_at: string;
  likes: number;
  edit_at: string;
  username: string;
};


export type Comment = {
  comment_id: string;
  note_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  username: string;
};
export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      spaceId: string;
      title: string;
      description: string;
      body: string;
      category: string;
    }) => {
      const res = await fetch("/api/notes", {
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
      return res.json() as Promise<{ data: Note }>;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["notes", res.data.note_id],
        res.data,
      );
      return;
    },
  });
};

// ---------- //
export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      noteId: string;
      userId: string;
      title: string;
      description: string;
      body: string;
      category: string;
    }) => {
      const res = await fetch(`/api/notes/${data.userId}/${data.noteId}`, {
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
      return res.json() as Promise<{ data: Note }>;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["notes", res.data.note_id],
        res.data,
      );
      return;
    },
  });
};

// ---------- //
export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      noteId: string;
    }) => {
      const res = await fetch(`/api/notes/${data.noteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errors = errorSchema.parse(await res.json()).errors;
        throw new Error(errors.at(0)?.message);
      }
      return;
    },
    onSuccess: (_res, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
        exact: true,
        type: "active",
      });
      queryClient.removeQueries({
        queryKey: ["notes", noteId],
        exact: true,
      });
    },
  });
};

// ---------- //
const getNote = async (noteId: string) => {
  const res = await fetch(`/api/notes/${noteId}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }

  const responseData = await res.json();
  return responseData.data as Note;
};

export const getNoteQueryOptions = (noteId: string) =>
  queryOptions({
    queryKey: ["notes", noteId],
    queryFn: () => getNote(noteId),
  });

// ---------- //
export const getNotes = async () => {
  const res = await fetch(`/api/notes`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }

  return (await res.json() as { data: Note[] }).data;
};

export const getNotesQueryOptions = queryOptions({
  queryKey: ["notes"],
  queryFn: getNotes,
});

// ---------- //
export const getAllNotes = async () => {
	const res = await fetch(`/api/all-notes`, {
	  headers: {
		Accept: "application/json",
	  },
	});
  
	if (!res.ok) {
	  const errors = errorSchema.parse(await res.json()).errors;
	  throw new Error(errors.at(0)?.message);
	}
  
	return (await res.json() as { data: Note[] }).data;
  };

  export const getAllNotesQueryOptions = queryOptions({
	queryKey: ["all-notes"],
	queryFn: getAllNotes,
  });

// ---------- //
  const getCountNotes = async (userId: string) => {
    const res = await fetch(`/api/count-notes/${userId}`, {
      headers: {
        Accept: "application/json",
      },
    });
  
    if (!res.ok) {
      const errors = errorSchema.parse(await res.json()).errors;
      throw new Error(errors.at(0)?.message);
    }
  
    const responseData = await res.json();
    console.log("getCountNotes:", responseData);
    return responseData.data as { CountNote: number };
  };
  
  export const getCountNotesQueryOptions = (userId: string) =>
    queryOptions({
      queryKey: ["count-notes", userId],
      queryFn: () => getCountNotes(userId),
    });

// ---------- //
const getNotesForUser = async (userId: string) => {
  const res = await fetch(`/api/user-notes/${userId}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }

  const responseData = await res.json();
  return responseData.data as Note;
};

export const getNotesForUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-notes", userId],
    queryFn: () => getNotesForUser(userId),
  });
// ---------- //
const getNotesForSpace = async (spaceId: string) => {
  const res = await fetch(`/api/space-notes/${spaceId}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }

  const responseData = await res.json();
  return responseData.data as Note;
};

export const getNotesForSpaceQueryOptions = (spaceId: string) =>
  queryOptions({
    queryKey: ["space-notes", spaceId],
    queryFn: () => getNotesForSpace(spaceId),
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
    return responseData.data as Note;
  };
  
  export const getUserQueryOptions = (userId: string) =>
    queryOptions({
      queryKey: ["users", userId],
      queryFn: () => getUser(userId),
    });

  // ---------- //
export const useLikeNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      noteId: string;
      likes: number;
    }) => {
      const res = await fetch(`/api/like-note/${data.noteId}`, {
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
      return res.json() as Promise<{ data: Note }>;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["like-note"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["like-note", res.data.note_id],
        res.data,
      );
      return;
    },
  });
};

// ---------- //
export const useCreateCommentNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      noteId: string;
      comment: string;
    }) => {
      console.log("useCreateCommentPostMutation.data()", data.comment)
      const res = await fetch(`/api/note-comments/${data.noteId}`, {
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
        queryKey: ["note-comments"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["note-comments", res.data.note_id],
        res.data,
      );
      return;
    },
  });
};
// ---------- //
const getCommentsForNote = async (noteId: string) => {
  const res = await fetch(`/api/note-comments/${noteId}`, {
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

export const getCommentsForNoteQueryOptions = (noteId: string) =>
  queryOptions({
    queryKey: ["note-comments", noteId],
    queryFn: () => getCommentsForNote(noteId),
  });


// ---------- //
export const useAddSavedNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      noteId: string;
    }) => {
      const res = await fetch(`/api/saved-notes/${data.noteId}`, {
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
      return res.json() as Promise<{ data: Note }>;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["saved-notes/"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["saved-notes/", res.data.note_id],
        res.data,
      );
      return;
    },
  });
};

// ---------- //

export const getSavedListToNote = async () => {
  const res = await fetch(`/api/saved-notes`, {
    headers: {
    Accept: "application/json",
    },
  });
  
  if (!res.ok) {
    const errors = errorSchema.parse(await res.json()).errors;
    throw new Error(errors.at(0)?.message);
  }
  
  return (await res.json() as { data: Note[] }).data;
  };

  export const getSavedListToNoteQueryOptions = queryOptions({
  queryKey: ["saved-notes"],
  queryFn: getSavedListToNote,
  });

  // ---------- //
export const useDeleteSavedNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      noteId: string;
    }) => {
      const res = await fetch(`/api/saved-notes/${data.noteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errors = errorSchema.parse(await res.json()).errors;
        throw new Error(errors.at(0)?.message);
      }
      return;
    },
    onSuccess: (_res, { noteId }) => {
      queryClient.invalidateQueries({
        queryKey: ["saved-notes"],
        exact: true,
        type: "active",
      });
      queryClient.removeQueries({
        queryKey: ["saved-notes", noteId],
        exact: true,
      });
    },
  });
};