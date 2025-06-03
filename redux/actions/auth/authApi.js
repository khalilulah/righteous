import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../utils/utilFunctions";
import { setCredentials } from "../../slices/auth/authSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.data?.action !== "changeDefaultPassword") {
            const loginResponse = {
              token: data?.data?.token,
              user: data?.data,
            };
            dispatch(setCredentials(loginResponse)); // Save token and user in the store
          } else {
            const loginResponse = {
              token: data?.data?.token,
            };
            dispatch(setCredentials(loginResponse)); // Save token and user in the store
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    changeDefaultPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/changeDefaultPassword",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/ResetPassword",
        method: "POST",
        body: credentials,
      }),
    }),
    sendOtp: builder.mutation({
      query: (credentials) => ({
        url: "/auth/sendOtp",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error("OTP sending failed:", error);
        }
      },
    }),
    registerGuardian: builder.mutation({
      query: (credentials) => {
        return {
          url: "/auth/register/guardian",
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
    addExistingGuardian: builder.mutation({
      query: (credentials) => {
        return {
          url: "/auth/guardian/sendRequest",
          method: "POST",
          body: credentials,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Error sending request:", error);
        }
      },
    }),
    registerTeacher: builder.mutation({
      query: (credentials) => {
        return {
          url: "/auth/register/teacher",
          method: "POST",
          body: credentials,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          console.error("Error creating new teacher:", error);
        }
      },
    }),
    fetchRequests: builder.query({
      query: (guardianId) =>
        `/requests?guardianId=${guardianId}&status=pending`,
    }),
    getInstitutions: builder.mutation({
      query: (teacherIdsArray) => {
        console.log(teacherIdsArray.length);

        return {
          url: "/auth/getTeacherOrgs",
          method: "POST",
          body: { teacherIds: teacherIdsArray },
        };
      },
      // async onQueryStarted(args, { dispatch, queryFulfilled }) {
      //   try {
      //     const { data } = await queryFulfilled;
      //   } catch (error) {
      //     console.error("Error creating new guardian:", error);
      //   }
      // },
    }),
  }),
});

export const {
  useLoginMutation,
  useSendOtpMutation,
  useRegisterGuardianMutation,
  useAddExistingGuardianMutation,
  useFetchRequestsQuery,
  useChangeDefaultPasswordMutation,
  useResetPasswordMutation,
  useRegisterTeacherMutation,
  useGetInstitutionsMutation,
} = authApi;
