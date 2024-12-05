import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { useState } from 'react';

import axios, { AxiosError } from 'axios';

import { useSignIn } from 'react-auth-kit';
import { useNavigate } from "react-router-dom";

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const signIn = useSignIn();

    // Email data entry
    const handleEmailChange = (e) => {
        setFormData({
            ...formData,
            email: e.target.value,
        })
    };

    // Password Data Entry
    const handlePasswordChange = (e) => {
        setFormData({
            ...formData,
            password: e.target.value,
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3005/login', formData)
            .then((res) => {
                if (res.status === 200) {
                    if (signIn(
                        {
                            token: res.data.token,
                            tokenType: "Bearer",
                            authState: res.data,
                            expiresIn: 100,
                        }
                    )) {

                        navigate('/');

                    }
                }
            }).catch((error) => {
                alert("Email or Password is wrong!!!")
            });
    }

    return (
        <div className="flex justify-center bg-black h-screen items-center">
            <Card color="transparent" shadow={false} className="text-neutral-50 bg-black p-5">
                {/* <Typography variant="h4" color="">
                    MAPA
                </Typography> */}
                <section class="wrapper">
                    <div class="top">MAPA</div>
                    <div class="bottom" aria-hidden="true">MAPA</div>
                </section>
                
                <Typography color="gray" className="mt-1 ml-1 font-normal text-white">
                    Enter your details to login.
                </Typography>
                <form className="mt-2 mb-2 w-80 max-w-screen-lg sm:w-auto">
                    <div className="mb-4 flex flex-col gap-6">

                        <Input size="lg" label="Email" color="white" onChange={handleEmailChange} />
                        <Input type="password" size="lg" label="Password" color="white" onChange={handlePasswordChange} />
                    </div>

                    <Button className="mt-6" fullWidth onClick={handleSubmit}>
                        Login
                    </Button>
                    <Typography className="mt-4 text-center font-normal text-white">
                        Need an account?{" "}
                        <a href="/register" className="font-medium text-gray-500">
                            Sign Up
                        </a>
                    </Typography>
                </form>
            </Card>
        </div>
    );
}

export default Login;