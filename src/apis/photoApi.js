import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const photoApi = createApi({
    reducerPath: 'photos',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3005',
    }),
    endpoints(builder) {
        return {
            fetchPhoto: builder.query({
                providesTags: (result, error, albumId) => {
                    return [{ type: 'Photo', id: albumId }]
                },
                query: (albumId) => {
                    return {
                        url: '/photos',
                        params: {
                            albumId: albumId
                        },
                        method: 'GET',
                    };
                },
            }),
            addPhoto: builder.mutation({
                invalidatesTags: (result, error, photo) => {
                    return [{ type: 'Photo', id: photo.albumId }];
                },
                query: (photo) => {
                    return{
                        url: '/photos',
                        method:'POST',
                        body: {
                            albumId: photo.albumId,
                            tags: photo.photoData.tags,
                            url: photo.photoData.url,
                        }
                    };
                },
            }),
            removePhoto: builder.mutation({
                invalidatesTags: (result, error, photo) => {
                    return [{ type: 'Photo', id: photo.id }]
                },
                query: (photoId) => {
                    return {
                        url: `/photos/${photoId}`,
                        method: 'DELETE',
                    };
                },
            }),
        };
    },
});

export const { useAddPhotoMutation, useFetchPhotoQuery, useRemovePhotoMutation } = photoApi;
export { photoApi }