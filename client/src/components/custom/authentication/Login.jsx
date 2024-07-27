import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@apollo/client";
import { LightbulbIcon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN } from "@/queries";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [login, result] = useMutation(LOGIN);

  const navigate = useNavigate();

  useEffect(() => {
    if (result.data) {
      localStorage.clear();
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("vertex-user-token", token);
    }
  }, [result.data]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (!username || !password) {
        return toast.error("Please fill the entire form");
      }

      await login({
        variables: { username, password },
        onError: (error) => console.log(error),
      });

      toast.success("Logged in, redirecting...");
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
    <div className="flex flex-col min-h-screen md:flex-row">
      <div className="flex items-center space-x-2 absolute top-8 left-8">
        <LightbulbIcon className="w-6 h-6  text-black" />
        <span className="text-xl text-black  font-semibold">
          Vertex
        </span>
      </div>

      <div className="flex mx-auto flex-col  justify-center h-screen bg-white w-full">
        <div className="flex justify-end">
          <Link to="/register">
            <Button
              variant={"ghost"}
              href="#"
              className="text-sm absolute top-8 right-8 font-medium text-gray-600"
            >
              Register
            </Button>
          </Link>
        </div>
        <form
          onSubmit={(e) => handleLogin(e)}
          className="flex flex-col items-center space-y-6 p-4 "
        >
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-gray-600">Log in to an existing account</p>
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
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
