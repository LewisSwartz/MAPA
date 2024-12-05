import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const userApi = createApi({
    reducerPath: 'users', 
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005',
    }),
    endpoints(builder) {
        return {
            fetchUser: builder.query({
                query: () => {
                    return {
                        url: '/users',
                        method: 'GET'
                    }
                }
            }),

            addUser: builder.mutation({
                query: (user) => {
                    return{
                        url: '/users',
                        method: 'POST',
                        body: {
                            name: user.name,
                            email: user.email,
                            password: user.password,
                            photoUrl: user.photoUrl,
                        }
                    }
                },
            }),

            editUser: builder.mutation({
                invalidatesTags: (result, error, user) => {
                  return [{type: "User", id: user.id}]
                },
                query: (user) => {
                    return {
                        url: `/users/${user.id}`,
                        method: 'PATCH',
                        body:{
                            name: user.name,
                            email: user.email,
                            photoUrl: user.photoUrl,
                        },
                    };
                },
            }),
        };
    },
})

export const { useFetchUserQuery, useAddUserMutation, useEditUserMutation } = userApi;
export { userApi };