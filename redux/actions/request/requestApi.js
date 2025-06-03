import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../utils/utilFunctions";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    acceptRequest: builder.mutation({
      query: (credentials) => ({
        url: "/requests/acceptRequest",
        method: "POST",
        body: credentials,
      }),
    }),
    rejectRequest: builder.mutation({
      query: (credentials) => ({
        url: "/requests/rejectRequest",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useAcceptRequestMutation, useRejectRequestMutation } =
  requestApi;
