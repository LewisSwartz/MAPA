import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const pause = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
};

const albumApi = createApi({
    reducerPath: "albums",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005',
        fetchFn: async (...argus) => {
            await pause(2000);
            return fetch(...argus);
        }
    }),
    endpoints(builder) {
        return {
            fetchAlbum: builder.query ({
                providesTags: (result, error, userId) => {
                    return [{type: 'Album', id: userId}]
                },
                query: (userId) => {
                    return {
                        url: '/albums',
                        params: {
                            _sort: 'id',
                            _order: 'desc',
                        },
                        method: 'GET',
                    }
                },
            }),
            fetchUserAlbum: builder.query ({
                providesTags: (result, error, userId) => {
                    return [{type: 'Album', id: userId}]
                },
                query: (userId) => {
                    return {
                        url: '/albums',
                        params: {
                            userId: userId,
                            _sort: 'id',
                            _order: 'desc',
                        },
                        method: 'GET',
                    }
                }
            }),
            addAlbum: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    return [{ type: 'Album', id: album.userId }];
                  },
                query: (album) => {
                    return {
                        url: '/albums',
                        method:'POST',
                        body: {
                            userId: album.userId,
                            userName: album.userName,
                            description: album.description,
                            isPublic: album.isPublic,
                        },
                    };
                },
            }),
            editAlbum: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    return [{ type: 'Album', id: album.userId }];
                },
                query: (album) => {
                    return {
                        url: `/albums/${album.albumId}`,
                        method: "PATCH",
                        body: {
                            userId: album.userId,
                            description: album.description,
                            albumName: album.albumName,
                            isPublic: album.isPublic,
                        }
                    };
                },
            }),
            removeAlbum: builder.mutation({
                invalidatesTags: (result, error, album) => {
                    return [{ type: 'Album', id: album.userId }];
                },
                query: (album) => {
                    return {
                        url: `/albums/${album.id}`,
                        method: 'DELETE'
                    };
                },
            }),
        };
    },
});

export const { useAddAlbumMutation, useFetchAlbumQuery, useFetchUserAlbumQuery, useRemoveAlbumMutation, useEditAlbumMutation } = albumApi;
export { albumApi };