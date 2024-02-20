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
  user_id: string;
  title: string;
  description: string;
  body: string;
  category: string;
  created_at: string;
  edit_at: string;
  username: string;
};

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
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
    return responseData.data as Note;
  };
  
  export const getCountNotesQueryOptions = (userId: string) =>
    queryOptions({
      queryKey: ["count-notes", userId],
      queryFn: () => getCountNotes(userId),
    });

// ---------- //
const getNotesForUser = async (userId: string) => {
  const res = await fetch(`/api/notes/${userId}`, {
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
    queryKey: ["notes", userId],
    queryFn: () => getNotesForUser(userId),
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