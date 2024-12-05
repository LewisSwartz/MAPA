import {
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useEffect, useState } from 'react';
import { useAddUserMutation } from "../store";
import { useNavigate } from "react-router-dom";

function Register() {

  const [userData, setUserData] = useState({

    profileUrl: '',

    name: '',

    email: '',

    password: '',

    photoUrl: '',

  });
  const [addUser, result] = useAddUserMutation("");
  const handleSubmit = () => {
    addUser(userData);
  }
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const handleName = (e) => {
    setUserData({
        ...userData,
        name : e.target.value
    });
  };

  const handleEmail = (e) => {
      setUserData({
          ...userData,
          email : e.target.value
      });
  };



// Password Data Entry

  const handlePassword = (e) => {
      setUserData({
          ...userData,
          password : e.target.value
      })
  };

  useEffect(() => {
    if (result.isSuccess) {
      navigate('/login')
    } else if (result.error) {
      setErrorMsg(result.error.data);
    }
  }, [navigate, result]);

  return (
    <div className="flex justify-center cbg h-screen items-center">
      <Card className="text-neutral-50 border-2 custombg p-5">
        <Typography variant="h4" color="blue-gray">
          Sign Up
        </Typography>
        <Typography className="mt-1 font-normal">
          Enter your details to register.
        </Typography>
        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-4 flex flex-col gap-6">
            <Input size="lg" label="Name" onChange={handleName} color="white"/>
            <Input size="lg" label="Email" onChange={handleEmail} color="white"/>
            <Input type="password" size="lg" label="Password" onChange={handlePassword} color="white"/>
          </div>
          {
            errorMsg ? <p className='text-red-500 bg-red-100 rounded-lg px-4 py-1 w-full'>{errorMsg}</p> : ''
          }
          <Button className="mt-6" fullWidth onClick={handleSubmit}>
            Register
          </Button>
          <Typography color="gray" className="mt-4 text-black text-center font-normal">
            Already have an account?
            <a href="/login" className="font-medium text-gray-200 ml-1">
              Sign In
            </a>
          </Typography>
        </form>
      </Card>
    </div>
  );
}

export default Register;