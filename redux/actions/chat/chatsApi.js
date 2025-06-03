import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../utils/utilFunctions";

export const chatsApi = createApi({
  reducerPath: "chatsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchChats: builder.query({
      query: ({ chatId }) => `/messages/${chatId}`,
    }),
    fetchUsers: builder.query({
      query: () => `/messages/list/users`,
    }),
    fetchGroups: builder.query({
      query: () => `/messages/list/groups`,
    }),
    createGroup: builder.mutation({
      query: (credentials) => {
        return {
          url: "/messages/createGroup",
          method: "POST",
          body: credentials,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error("Error creating new guardian:", error);
        }
      },
    }),
    renameGroup: builder.mutation({
      query: (credentials) => {
        return {
          url: "/messages/renameGroup",
          method: "PUT",
          body: credentials,
        };
      },
    }),
    deleteGroup: builder.mutation({
      query: (credentials) => {
        return {
          url: "/messages/deleteGroup",
          method: "DELETE",
          body: credentials,
        };
      },
    }),
    modifyGroupUsers: builder.mutation({
      query: (credentials) => {
        console.log("Credentials", credentials);
        return {
          url: "/messages/modifyGroupUsers",
          method: "PUT",
          body: credentials,
        };
      },
    }),
  }),
});

export const {
  useFetchChatsQuery,
  useFetchUsersQuery,
  useFetchGroupsQuery,
  useCreateGroupMutation,
  useRenameGroupMutation,
  useDeleteGroupMutation,
  useModifyGroupUsersMutation,
} = chatsApi;
