import { useFetchPhotoQuery } from "../store";
import { Typography, Button, CardBody, Card } from "@material-tailwind/react";
import { GoTag, GoTrash } from "react-icons/go";
import { useRemovePhotoMutation } from "../apis/photoApi";

function Photo({ albumId, isProfile = false}) {
    const { data, error, isFetching } = useFetchPhotoQuery(albumId);

    const [ removePhoto, result ] = useRemovePhotoMutation();

    const handleDelete = (photoId) => {
        removePhoto(photoId)
    };

    let content;

    if (isFetching) {
        content = <div>Loading...</div>
    } else if (error) {
        content = <div>Error fetching...</div>
    } else if (data.length <= 2) {
        content = <div>
            <div className="mt-1 flex justify-center gap-2">
                {data.map((photo) => {
                    return (
                        <Card className="w-1/2">
                            <div className="relative">
                                {
                                    isProfile ? <GoTrash className="absolute right-2 top-2 cursor-pointer text-gray-100 bg-red-900/50 
                                    rounded-md p-1 text-2xl" onClick={() => handleDelete(photo.id)} /> : ""
                                }
                                <img src={photo.url} key={photo.id} alt={photo.id} className="h-80 w-full rounded-md" />
                            </div>
                            
                            <CardBody className="flex items-center">
                                <Typography variant="h5" className="flex flex-wrap items-center">
                                <GoTag className="text-xl" />
                                    <div>
                                        {
                                            photo.tags.map((tag) => {
                                                return (
                                                    <Button variant="outlined" size="sm" className="ml-3 mt-2">
                                                        {tag}
                                                    </Button>
                                                )
                                            })
                                        }
                                    </div>
                                </Typography>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    } 
    else {
        content = <div>
            <div className="grid grid-cols-3 gap-2 mt-1">
                {data.map((photo) => {
                    return (
                        <Card>
                            <div className="relative">
                                {
                                    isProfile ? <GoTrash className="absolute right-2 top-2 cursor-pointer text-gray-100 bg-red-900/10 
                                    rounded-md p-1 text-2xl" onClick={() => handleDelete(photo.id)} /> : ""
                                }
                                <img src={photo.url} key={photo.id} alt={photo.id} className="h-80 w-full rounded" />
                            </div>
                            
                            <CardBody className="">
                                <Typography variant="h5" className="flex items-center">
                                    <GoTag />
                                    <div>
                                        {
                                            photo.tags.map((tag) => {
                                                return (
                                                    <Button variant="outlined" size="sm" className="ml-3 mt-1">
                                                        {tag}
                                                    </Button>
                                                )
                                            })
                                        }
                                    </div>

                                </Typography>
                            </CardBody>

                        </Card>

                    );
                })}
            </div>
        </div>
    }

    return (
        <div>
            {content}
        </div>
    )
}

export default Photo;