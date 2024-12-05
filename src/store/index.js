import {configureStore} from "@reduxjs/toolkit";
import { userApi } from "../apis/userApi";
import { albumApi } from "../apis/albumApi";
import { photoApi } from "../apis/photoApi";

export const store = configureStore({
    reducer: {
        [userApi.reducerPath] : userApi.reducer,
        [albumApi.reducerPath] : albumApi.reducer,
        [photoApi.reducerPath] : photoApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(userApi.middleware)
            .concat(albumApi.middleware)
            .concat(photoApi.middleware);
    }
});

export { useAddUserMutation, useFetchUserQuery, useEditUserMutation } from '../apis/userApi';
export { useAddAlbumMutation, useFetchAlbumQuery, useFetchUserAlbumQuery, useRemoveAlbumMutation, useEditAlbumMutation } from '../apis/albumApi';
export {useAddPhotoMutation, useFetchPhotoQuery} from '../apis/photoApi';