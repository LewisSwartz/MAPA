import { useAuthUser, useSignOut } from "react-auth-kit";
import {

    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Typography,
    Navbar,
    Switch,
    Textarea,
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Input,
    DialogFooter,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ImageUploading from "react-images-uploading"
import { GoHome, GoPerson, GoPlus } from "react-icons/go";
import { useAddAlbumMutation, useAddPhotoMutation, useEditUserMutation, useFetchUserQuery } from "../store";
import axios from "axios";
import PublicAlbum from "./PublicAlbum";
import PrivateAlbum from "./PrivateAlbum";


function Home() {
    const auth = useAuthUser();
    const logOut = useSignOut();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("Home");

    const [isPublic, setIsPublic] = useState(true);
    const handleLogOut = () => {
        logOut();
        navigate('/login');
    }

    const [albumData, setAlbumData] = useState({
        userId: auth().user.id,
        userName: auth().user.name,
        description: '',
        isPublic: true,

    });



    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    const [user, setUser] = useState({
        id: auth().user.id,
        name: auth().user.name,
        email: auth().user.email,
        photoUrl: auth().user.photoUrl,
    });
    const [addAlbum, result] = useAddAlbumMutation();
    const [addPhoto, photoResult] = useAddPhotoMutation();
    const [editUser, editResult] = useEditUserMutation();

    const handleName = (e) => {
        setUser({
            ...user,
            name: e.target.value
        });
    };

    const handleEmail = (e) => {
        setUser({
            ...user,
            email: e.target.value
        });
    };

    const handleDescription = (e) => {
        setAlbumData({
            ...albumData,
            description: e.target.value
        });
    };

    const handlePublic = () => {
        setAlbumData({
            ...albumData,
            isPublic: !isPublic
        });
        setIsPublic(!isPublic)

    };

    const handleUserEdit = () => {
        editUser(user);
        handleOpen();
    }

    const handleUserPhoto = async (imageList) => {

        setUser({
            ...user,
            photoUrl: imageList[0].data_url
        });

    };

    const onSubmit = () => {

        addAlbum(albumData)
            .then((res) => {
                // console.log(res.data.id);
                addPhoto({
                    albumId: res.data.id,
                    photoData: photoData
                });
            })
            .finally(() => {
                if (albumData.isPublic) {
                    document.querySelector('li[data-value="Home"]').click()
                } else {
                    document.querySelector('li[data-value="Profile"]').click()
                }
            });

    };

    const [photoData, setPhotoData] = useState({
        albumId: '',
        url: '',
        tags: []
    });

    const [images, setImages] = useState([]);
    const maxNumber = 69;
    const { data, error, isFetching } = useFetchUserQuery();

    const onChange = async (imageList, addUpdateIndex) => {
        // data for submit
        // console.log(imageList, addUpdateIndex);
        if (imageList[0]) {
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
            );
            console.log(response);
            const MIN_SCORE = 0.95;
            const tags = [];
            for (const label of response.data.responses[0].labelAnnotations) {
                if (label.score > MIN_SCORE) {
                    tags.push(label.description);
                }
            }
            console.log(tags);

            setPhotoData({
                ...photoData,
                url: imageList[0].data_url,
                tags: tags
            });
        }

        setImages(imageList);

    };


    return (

        <div className="cbg overflow-y-auto">

            <Tabs value={activeTab} className="pb-0 relative h-screen overflow-y-auto">
                <Navbar variant="gradient" color="gray" className="max-w-screen-xl mx-auto rounded-lg navbg py-2 px-4 mt-3">
                    <div className="flex items-center justify-center ">
                        <Typography
                            as="a"
                            href="#"
                            className="mr-4 cursor-pointer py-1.5 font-medium font-mono text-3xl text-bold text-gray-900"
                        >
                            Mandalay Amateur Photo Association
                        </Typography>
                    </div>
                </Navbar>
                <div className="flex justify-between navbg max-w-screen-sm rounded-2xl mx-auto items-center px-3 inset-x-0 fixed z-10 bottom-4">
                    <TabsHeader className="flex gap-2 bg-transparent text-white p-3" indicatorProps={{ className: "bg-gray-500/50" }}>
                        <Tab value="Home" className={activeTab === "Home" ? "text-white px-3 rounded-3xl w-36" : "text-black px-3 rounded-3xl w-36"} onClick={() => setActiveTab("Home")}>
                            <GoHome className="text-3xl" />
                        </Tab>
                        <Tab value="Profile" className={activeTab === "Profile" ? "text-white px-3 rounded-3xl w-36" : "text-black px-3 rounded-3xl w-36"} onClick={() => setActiveTab("Profile")}>
                            <GoPerson className="text-3xl" />
                        </Tab>
                        <Tab value="CreateAlbum" className={activeTab === "CreateAlbum" ? "text-white px-3 rounded-3xl w-36" : "text-black px-3 rounded-3xl w-36"} onClick={() => setActiveTab("CreateAlbum")}>
                            <GoPlus className="text-3xl" />
                        </Tab>
                    </TabsHeader>
                    <div className="items-center gap-2">
                        <Menu>
                            <MenuHandler>
                                {
                                    user.photoUrl === "" ? <div className="flex w-12 h-12 items-center justify-center bg-gray-300 rounded-full">
                                        <GoPerson className="text-xl text-black" />
                                    </div> : 
                                    <Avatar
                                    variant="circular"
                                    alt="tania andrew"
                                    className="cursor-pointer"
                                    src={user.photoUrl} />
                                }
                            </MenuHandler>
                            <MenuList>
                                <MenuItem className="flex items-center gap-2">
                                    <Typography variant="small" className="font-normal">
                                        {user.name}
                                    </Typography>

                                </MenuItem>

                                <hr className="my-2 border-blue-gray-50" />

                                <MenuItem className="flex items-center gap-2" onClick={handleOpen}>
                                    <Typography variant="small" className="font-normal">
                                        {/* <a href="/EditProfile">Edit Profile</a> */}
                                        Edit Profile

                                    </Typography>
                                </MenuItem>

                                <MenuItem className="flex items-center gap-2" onClick={handleLogOut}>

                                    <Typography variant="small" className="font-normal">
                                        Sign Out
                                    </Typography>
                                </MenuItem>
                            </MenuList>
                        </Menu>

                    </div>

                </div>
                <Dialog
                    size="xs"
                    open={open}
                    handler={handleOpen}
                    className="bg-transparent shadow-none"
                >
                    <Card className="mx-auto w-full max-w-[24rem]">
                        <CardHeader
                            variant="gradient"
                            // color="gray"
                            className="mb-2 grid h-20 place-items-center cbg"
                        >
                            <Typography variant="h3" color="white">
                                Edit Profile
                            </Typography>
                        </CardHeader>
                        <CardBody className="flex flex-col gap-4">
                            <ImageUploading
                                onChange={handleUserPhoto}
                                dataURLKey="data_url"
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    isDragging,
                                    dragProps,
                                }) => (
                                    <div className="flex justify-center">
                                        <button
                                            style={isDragging ? { color: 'red' } : undefined}
                                            onClick={onImageUpload}
                                            {...dragProps}
                                            className="w-24 h-24 items-center justify-center rounded-full bg-black text border-4 border-gray-500"
                                        >
                                            {
                                                user.photoUrl === "" ? <GoPerson className="mx-auto text-3xl text-white" /> :
                                                    <img alt="Profile" src={user.photoUrl} className="w-full h-full bg-center bg-cover rounded-full" />
                                            }
                                        </button>
                                    </div>

                                )}
                            </ImageUploading>
                            <Input label="Name" size="lg" value={user.name} onChange={handleName} />
                            <Input label="Email" size="lg" value={user.email} onChange={handleEmail} />
                        </CardBody>

                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="gradient" color="red" onClick={handleOpen}>
                                Cancel
                            </Button>
                            <Button variant="gradient" onClick={handleUserEdit} >
                                Confirm
                            </Button>
                        </CardFooter>
                        {/* <DialogFooter className="flex justify-end gap-2">
                            
                        </DialogFooter> */}
                    </Card>

                </Dialog>
                <TabsBody className="flex justify-between max-w-screen-xl rounded-lg mx-auto items-center px-4">
                    <TabPanel value="Home">
                        <PublicAlbum users={data} userId={auth().user.id}/>
                    </TabPanel>
                    <TabPanel value="Profile">
                        <PrivateAlbum userId={auth().user.id} user={user} />
                    </TabPanel>
                    <TabPanel value="CreateAlbum" className="">
                        <div className="max-w-screen-lg mx-auto bg-gray-300 p-3 rounded-lg shadow-lg">
                            <div className="flex justify-end">
                                <Switch color="green" defaultChecked label={isPublic ? "Public" : "Private"} onClick={handlePublic} />
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
                            />

                            <ImageUploading
                                multiple
                                value={images}
                                onChange={onChange}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                            >
                                {({
                                    imageList,
                                    onImageUpload,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps,
                                }) => (
                                    // write your building UI
                                    <div className="upload__image-wrapper">
                                        <hr />
                                        <br />
                                        <button
                                            style={isDragging ? { color: 'red' } : undefined}
                                            onClick={onImageUpload}
                                            {...dragProps}
                                        >
                                            Click Or Drop Here To Upload An Image
                                        </button>
                                        &nbsp;
                                        {imageList.map((image, index) => (
                                            <div key={index} className="image-item">
                                                <img src={image['data_url']} alt="" width="400" />
                                                <div className="image-item__btn-wrapper">
                                                    <button onClick={() => onImageRemove(index)}>Remove</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ImageUploading>
                            <br /><br />
                            <div className="flex justify-end">
                                <Button size="sm" className="rounded-md" onClick={onSubmit}>
                                    Add
                                </Button>
                            </div>
                        </div>
                    </TabPanel>
                </TabsBody>
            </Tabs>
        </div>
    )
}

export default Home;