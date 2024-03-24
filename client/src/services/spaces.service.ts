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
  country: string; 
  city: string;
  university: string;
  description: string;
  category: string;
  created_at: string;
  edit_at: string;
  username: string;
};

export type Follow = {
  space_id: string;
  follow: true | false
};

export const useCreateSpaceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      country: string; 
      city: string;
      university: string;
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

export const getAllSpaces = async () => {
	const res = await fetch(`/api/all-spaces`, {
        method: "GET",
	  headers: {
		Accept: "application/json",
	  },
	});
  
	if (!res.ok) {
	  const errors = errorSchema.parse(await res.json()).errors;
	  throw new Error(errors.at(0)?.message);
	}
  
	return (await res.json() as { data: Space[] }).data;
  };

  export const getAllSpacesQueryOptions = queryOptions({
	queryKey: ["all-spaces"],
	queryFn: getAllSpaces,
  });




  const getSpace = async (spaceId: string) => {
    const res = await fetch(`/api/spaces/${spaceId}`, {
      headers: {
        Accept: "application/json",
      },
    });
  
    if (!res.ok) {
      const errors = errorSchema.parse(await res.json()).errors;
      throw new Error(errors.at(0)?.message);
    }
  
    const responseData = await res.json();
    console.log("getSpace data: ", responseData);
    return responseData.data as Space;
  };
  
  export const getSpaceQueryOptions = (spaceId: string) =>
    queryOptions({
      queryKey: ["spaces", spaceId],
      queryFn: () => getSpace(spaceId),
    });



    // export const useFollowToSpaceMutation = () => {
    //   const queryClient = useQueryClient();
    
    //   return useMutation({
    //     mutationFn: async (data: {
    //       spaceId: string;
    //       userId: string;
    //     }) => {
    //       const res = await fetch(`/api/follow/${data.spaceId}/${data.userId}`, {
    //         method: "POST",
    //         headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //       });
    //       console.log("send id data: ",data)
    //       if (!res.ok) {
    //         const errorData = await res.json();
    //         throw new Error(errorData.errors[0].message);
    //       }
    //       return res.json();
    //     },
    //     onSuccess: (res) => {
    //       const spaceId = res.data.space_id; // Проверяем наличие space_id в ответе
    //       if (spaceId) {
    //         queryClient.invalidateQueries({
    //           queryKey: ["follow"],
    //           exact: true,
    //           type: "active",
    //         });
    //         queryClient.setQueryData(
    //           ["follow", spaceId],
    //           res.data,
    //         );
    //       }
    //     },
    //   });
    // };
    
    export const useFollowToSpaceMutation = () => {
      const queryClient = useQueryClient();
    
      return useMutation({
        mutationFn: async (data: {
          space_id: string;
        }) => {
          const res = await fetch("/api/spaces/follow", {
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
          return res.json() as Promise<{ data: Follow }>;
        },
        onSuccess: (res) => {
          queryClient.invalidateQueries({
            queryKey: ["/spaces/follow"],
            exact: true,
            type: "active",
          });
          queryClient.setQueryData(
            ["/spaces/follow", res.data.space_id],
            res.data,
          );
          return;
        },
      });
    };


    export const useUnFollowToSpaceMutation = () => {
      const queryClient = useQueryClient();
    
      return useMutation({
        mutationFn: async (data: {
          space_id: string;
        }) => {
          const res = await fetch("/api/spaces/unfollow", {
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
          return res.json() as Promise<{ data: Follow }>;
        },
        onSuccess: (res) => {
          queryClient.invalidateQueries({
            queryKey: ["/spaces/unfollow"],
            exact: true,
            type: "active",
          });
          queryClient.setQueryData(
            ["/spaces/unfollow", res.data.space_id],
            res.data,
          );
          return;
        },
      });
    };

    const getSpaceMembers = async (spaceId: string) => {
      const res = await fetch(`/api/spaces/members/${spaceId}`, {
        headers: {
          Accept: "application/json",
        },
      });
    
      if (!res.ok) {
        const errors = errorSchema.parse(await res.json()).errors;
        throw new Error(errors.at(0)?.message);
      }
    
      const responseData = await res.json();
      console.log("getSpaceMembers data: ", responseData);
      return responseData.data as Space;
    };
    
    export const getSpaceMembersQueryOptions = (spaceId: string) =>
      queryOptions({
        queryKey: ["spaces", spaceId],
        queryFn: () => getSpaceMembers(spaceId),
      });



      const getCheckFollowing = async (spaceId: string) => {
        const res = await fetch(`/api/spaces/check-following/${spaceId}`, {
          headers: {
            Accept: "application/json",
          },
        });
      
        if (!res.ok) {
          const errors = errorSchema.parse(await res.json()).errors;
          throw new Error(errors.at(0)?.message);
        }
      
        const responseData = await res.json();
        console.log("getCheckFollowing data: ", responseData);
        return responseData.data as Follow;
      };
      
      export const getCheckFollowingQueryOptions = (spaceId: string) =>
        queryOptions({
          queryKey: ["spaces", spaceId],
          queryFn: () => getCheckFollowing(spaceId),
        });