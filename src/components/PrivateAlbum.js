import {
    Switch,
    Textarea,
    Avatar,
    Button,
    Typography,
    Card,
    CardHeader,
    CardBody,
    Dialog,
    DialogBody,
} from "@material-tailwind/react";
import { useAddPhotoMutation, useFetchUserAlbumQuery, useRemoveAlbumMutation, useEditAlbumMutation } from "../store";
import Photo from './Photo'
import { FaEarthAmericas, FaLock } from "react-icons/fa6";
import { GoLockGoZap, GoLock, GoTrash, GoPlus, GoPencil, GoSync, GoPerson } from "react-icons/go";
import ImageUploading from "react-images-uploading";
import axios from "axios";
import { useState } from "react";


function PrivateAlbum({ userId, user }) {
    const { data, error, isFetching } = useFetchUserAlbumQuery(userId);
    const [removeAlbum, result] = useRemoveAlbumMutation();
    const [albumId, setAlbumId] = useState();
    const [editAlbum, editResult] = useEditAlbumMutation();
    const maxNumber = 69;
    const [addPhoto, photoResult] = useAddPhotoMutation();
    const [loading, setLoading] = useState(false);
    const handleDescription = (e) => {
        setAlbumData({
            ...albumData,
            description: e.target.value
        });
    };

    const onSubmit = () => {
        editAlbum(albumData);
        handleOpen();
    }
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    }
    const onChange = async (imageList, addUpdateIndex) => {
        if (imageList[0]) {
            setLoading(true)
            const response = await axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyClxGPA_0e1kdez3fsQMCVaaKuCXznlxxE', {
                "requests": [
                    {
                        "features": [
                            {
                                "maxResults": 10,
                                "type": "LABEL_DETECTION"
                            }
                        ],
                        "image": {
                            "content": imageList[0].data_url.substring(imageList[0].data_url.indexOf('base64,') + 7)
                        }
                    }
                ]
            }
            ).finally(() => setLoading(false));
            // console.log(response);
            const MIN_SCORE = 0.88;
            const tags = [];
            for (const label of response.data.responses[0].labelAnnotations) {
                if (label.score > MIN_SCORE) {
                    tags.push(label.description);
                }
            }
            // console.log(tags);

            addPhoto({
                albumId: albumId,
                photoData: {
                    url: imageList[0].data_url,
                    tags: tags,
                }

            });
        }
    };

    const handleClick = (album) => {
        setIsPublic(album.isPublic);
        setAlbumData({
            ...albumData,
            albumId: album.id,
            userId: album.userId,
            description: album.description,
            isPublic: album.isPublic,
        });
        handleOpen();
    }

    const [isPublic, setIsPublic] = useState(true);

    const [albumData, setAlbumData] = useState({
        userId: "",
        description: '',
        isPublic: true,

    });


    const handlePublic = () => {
        setAlbumData({
            ...albumData,
            isPublic: !albumData.isPublic
        });
        setIsPublic(!isPublic)
    };
    const [photoData, setPhotoData] = useState({
        albumId: '',
        url: '',
        tags: []
    });
    const handleDelete = (album) => {
        removeAlbum(album);
    }

    let content;

    if (isFetching) {
        content = <div>Loading...</div>
    } else if (error) {
        content = <div>Error Fetching...</div>
    } else {
        content = data.map((album) => {
            return (
                <div key={album.id}>
                    <Card className="mt-1">
                        <div className="flex justify-end mt-4">
                            {/* <div className="flex">
                                <Avatar
                                    variant="circular"
                                    alt="tania andrew"
                                    className="cursor-pointer mt-2 ml-4"
                                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                                />
                                <div className="flex">
                                    <Typography className="mt-4 ml-2 font-bold">{user.name}</Typography>
                                    <div className="mt-5 ml-2">{album.isPublic ? <FaEarthAmericas /> : <GoLock />}</div>
                                </div>
                            </div> */}

                            <div className="flex items-center">
                                <ImageUploading
                                    multiple
                                    onChange={onChange}
                                    maxNumber={maxNumber}
                                    dataURLKey="data_url"
                                >
                                    {({
                                        imageList,
                                        onImageUpload,
                                        onImageRemoveAll,
                                        onImageUpdate,
                                        onImageRemove,
                                        isDragging,
                                        dragProps,
                                    }) => (

                                        <Button color="blue" style={isDragging ? { color: 'red' } : undefined}
                                            onClick={() => {
                                                onImageUpload()
                                                setAlbumId(album.id)

                                            }}
                                            {...dragProps} className="mr-3 flex items-center p-2">
                                            {
                                                loading ? <GoSync className="animate-spin mr-1" /> : <GoPlus className="text-md mr-1" />
                                            }
                                            Add Photo</Button>
                                    )}
                                </ImageUploading>

                                <Button color="green" className="mr-3 p-2 flex items-center " onClick={() => handleClick(album)}>
                                    <GoPencil className="text-md mr-1" /> Edit
                                </Button>
                                <Button className="mr-3 p-2 flex items-center" onClick={() => handleDelete(album)}>
                                    {
                                        result.isLoading ? <GoSync className="animate-spin mr-1" /> : <GoTrash className="text-md mr-1" />
                                    }
                                    Delete
                                </Button>
                            </div>
                        </div>
                        <CardHeader color="" className="w-78 mt-5 pb-2" shadow={false}>
                            <Photo albumId={album.id} isProfile={true} />
                        </CardHeader>
                        <CardBody>
                            <div variant="h5" color="blue-gray" className="mt-3 items-center">
                                <div className="flex items-center">
                                    {
                                        user.photoUrl === "" ?
                                            <div className="flex w-12 h-12 items-center justify-center bg-gray-300 rounded-full">
                                                <GoPerson className="text-xl text-black" />
                                            </div> :
                                            <Avatar
                                                variant="circular"
                                                alt="tania andrew"
                                                className="cursor-pointer mt-2 ml-4"
                                                src={user.photoUrl}
                                            />
                                    }

                                    <div className="flex">
                                        <Typography className="mt-4 ml-2 font-bold">{user.name}</Typography>
                                        <div className="mt-5 ml-2">{album.isPublic ? <FaEarthAmericas /> : <GoLock />}</div>
                                    </div>
                                </div>
                                {/* <Typography className="ml-2 font-bold">{user.name}</Typography> */}

                                <div className="ml-2 bg-gray-200 p-2 rounded-md mt-3">
                                    {album.description}
                                </div>
                            </div>
                        </CardBody>
                        {/* <CardFooter className="pt-0">
                                    <Button>Read More</Button>
                                </CardFooter> */}
                    </Card>
                </div>
            )
        })
    }

    return (
        <div>
            {content}
            <Dialog open={open} handler={handleOpen}>
                <DialogBody className="bg-black rounded-md">
                    <div className="flex border-b border-b-gray-900">
                        <Typography variant='h6' className="text-white ">
                            Edit Album
                        </Typography>
                    </div>
                    <div className="flex justify-end">
                        <Switch color="green" checked={isPublic} label={isPublic ? "Public" : "Private"} onClick={handlePublic} />
                    </div>
                    <Textarea
                        rows={1}
                        placeholder="ADD SOME DESCRIPTION"
                        className="min-h-full !border-0 focus:border-transparent text-xl"
                        containerProps={{
                            className: "grid h-full",
                        }}
                        labelProps={{
                            className: "before:content-none after:content-none",
                        }}
                        onChange={handleDescription}
                        value={albumData.description}
                    />
                    <div className="flex items-center justify-center gap-3">
                        <Button color="red" onClick={handleOpen}>
                            Cancel
                        </Button>
                        <Button color="blue" onClick={onSubmit}>
                            Save
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    )
}

export default PrivateAlbum;