import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@apollo/client";
import { LightbulbIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { CREATE_USER, LOGIN } from "@/queries";

const Register = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [createUser, loadingUser] = useMutation(CREATE_USER);
  const [login, result, loadingLogin] = useMutation(LOGIN);

  useEffect(() => {
    if (loadingUser === true || loadingLogin === true) {
      setLoading(true);
    }
  }, [loadingUser, loadingLogin]);

  const navigate = useNavigate();

  useEffect(() => {
    if (result.data) {
      localStorage.clear();
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("rivis-user-token", token);
    }
  }, [result.data]);

  const handleRegister = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (!username || !password) {
        return toast.error("Please fill the entire form");
      } else if (username.length < 3) {
        return toast.error("Username is too short");
      } else if (password.length < 8) {
        return toast.error("Password is too short");
      }

      await createUser({
        variables: { username, password },
        onError: (error) => console.log(error),
      });

      await login({
        variables: { username, password },
        onError: (error) => console.log(error),
      });

      toast.success("Registration successful");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      return toast.error("An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div
        className="absolute left-4 top-4 flex items-center space-x-2 hover:cursor-pointer md:left-8 md:top-8"
        onClick={() => navigate("/")}
      >
        <LightbulbIcon className="h-6 w-6 text-black md:text-white" />
        <span className="text-xl font-semibold text-black md:text-white">
          Rivis
        </span>
      </div>
      <div className="hidden h-screen flex-col justify-between bg-black p-8 text-white sm:flex md:w-1/2">
        <div className="mt-auto">
          <p className="text-lg font-medium">
            “This is the best platform to learn and develop skills and it also
            has a great community. It feels illegal to know!”
          </p>
          <p className="mt-4">Sofia Davis</p>
        </div>
      </div>
      <div className="flex h-screen w-full flex-col justify-center bg-white md:w-1/2">
        <div className="flex justify-end">
          <Link to="/login">
            <Button
              variant={"ghost"}
              className="absolute right-4 top-4 text-sm font-medium text-gray-600 md:right-8 md:top-8"
            >
              Login
            </Button>
          </Link>
        </div>
        <form
          onSubmit={handleRegister}
          className="flex flex-col items-center space-y-6 p-4"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Register an account</h2>
            <p className="text-gray-600">
              Create an account on the platform for free
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              onChange={({ target }) => setUsername(target.value)}
              value={username}
              id="username"
              placeholder="Enter username here..."
              disabled={loading}
            />
          </div>
          <div className="w-full max-w-sm space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
              placeholder="Enter password here..."
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            className="w-1/2 max-w-sm bg-black text-white"
            disabled={loading}
          >
            Sign Up
          </Button>
          <p className="text-center text-xs text-gray-500">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
