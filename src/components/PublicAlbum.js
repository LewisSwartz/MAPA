import {

    Avatar,
    Button,
    Typography,
    Card,
    CardHeader,
    CardBody,
} from "@material-tailwind/react";
import { GoPerson, GoTag } from "react-icons/go";
import { useFetchAlbumQuery } from "../store";
import Photo from './Photo'
import { FaEarthAmericas, FaLock } from "react-icons/fa6";
import { GoLock } from "react-icons/go";

function PublicAlbum({ users, userId }) {
    const { data, error, isFetching } = useFetchAlbumQuery(userId);
    let content;

    if (isFetching) {
        content = <div>Loading...</div>
    } else if (error) {
        content = <div>Error Fetching...</div>
    } else {
        content = data.map((album) => {
            if (album.isPublic) {
                return (
                    <div key={album.id}>
                        <Card className="mt-1">
                            {/* {
                                users.map((user) => {
                                    if (user.id === album.userId) {
                                        
                                        return (
                                            <div className="flex items-center" key={user.id}>
                                                {
                                                    user.photoUrl === "" ?
                                                        <div className="flex w-10 h-10 mt-2 ml-4 items-center justify-center bg-gray-300 rounded-full">
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

                                        )
                                    }

                                })
                            } */}
                            <CardHeader color="" className="w-78 mt-5 pb-2" shadow={false}>
                                <Photo albumId={album.id} />
                            </CardHeader>
                            <CardBody>

                                <div variant="h5" color="blue-gray" className="mt-3 items-center">

                                    {/* {
                                        users.map((user) => {
                                            if (user.id === album.userId) {
                                                console.log(user.name)
                                                return (
                                                    <Typography className="ml-2 font-bold">{user.name}</Typography>

                                                )
                                            }

                                        })
                                    } */}
                                    {
                                        users.map((user) => {
                                            if (user.id === album.userId) {

                                                return (
                                                    <div className="flex items-center" key={user.id}>
                                                        {
                                                            user.photoUrl === "" ?
                                                                <div className="flex w-10 h-10 mt-2 ml-4 items-center justify-center bg-gray-300 rounded-full">
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

                                                )
                                            }

                                        })
                                    }
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
            }

        })
    }

    return (
        <div>
            {content}
        </div>
    )
}

export default PublicAlbum;