import { queryOptions, useMutation, useQueryClient } from "@tanstack/vue-query";
import { z } from "zod";

const errorSchema = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
    }),
  ),
});

export type SpaceEvent = {
    event_id: string;
    space_id: string;
    creator: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    date: string;
    created_at: string;
    edit_at: string;
    username: string;
    spacename: string;
  };


  // Create a event for space 
    export const useCreateSpaceEventMutation = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (data: {
        space_id: string;
        title: string;
        description: string;
        start_time: string;
        end_time: string;
        date: string;
      }) => {
        const res = await fetch("/api/events", {
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
        return res.json() as Promise<{ data: SpaceEvent }>;
      },
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: ["events"],
          exact: true,
          type: "active",
        });
        queryClient.setQueryData(
          ["events", res.data.event_id],
          res.data,
        );
        return;
      },
    });
  };

  // Get event for space by spaceId

  const getSpaceEvent = async (spaceId: string) => {
    const res = await fetch(`/api/events/${spaceId}`, {
      headers: {
        Accept: "application/json",
      },
    });
  
    if (!res.ok) {
      const errors = errorSchema.parse(await res.json()).errors;
      throw new Error(errors.at(0)?.message);
    }
  
    const responseData = await res.json();
    console.log("getSpaceEvent data: ", responseData);
    // return (await res.json() as { data: SpaceEvent[] }).data;
    return responseData.data as SpaceEvent;
  };
  
  export const getSpaceEventQueryOptions = (spaceId: string) =>
    queryOptions({
      queryKey: ["events", spaceId],
      queryFn: () => getSpaceEvent(spaceId),
    });



  // Delete event 
  export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      eventId: string;
    }) => {
      const res = await fetch(`/api/events/${data.eventId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errors = errorSchema.parse(await res.json()).errors;
        throw new Error(errors.at(0)?.message);
      }
      return;
    },
    onSuccess: (_res, { eventId }) => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        exact: true,
        type: "active",
      });
      queryClient.removeQueries({
        queryKey: ["events", eventId],
        exact: true,
      });
    },
  });
};

// Follow to event

// ---------- //
export const useFollowEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      eventId: string;
    }) => {
      const res = await fetch(`/api/follow-events/${data.eventId}`, {
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
      return res.json() as Promise<{ data: SpaceEvent }>;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["follow-events"],
        exact: true,
        type: "active",
      });
      queryClient.setQueryData(
        ["follow-events", res.data.event_id],
        res.data,
      );
      return;
    },
  });
};

