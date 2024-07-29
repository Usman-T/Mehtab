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

      const { data } = await login({
        variables: { username, password },
      });

      toast.success("Log in successful");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="absolute left-8 top-8 flex items-center space-x-2">
        <LightbulbIcon className="h-6 w-6 text-black" />
        <span className="text-xl font-semibold text-black">Vertex</span>
      </div>

      <div className="mx-auto flex h-screen w-full flex-col justify-center bg-white">
        <div className="flex justify-end">
          <Link to="/register">
            <Button
              variant={"ghost"}
              href="#"
              className="absolute right-8 top-8 text-sm font-medium text-gray-600"
            >
              Register
            </Button>
          </Link>
        </div>
        <form
          onSubmit={(e) => handleLogin(e)}
          className="flex flex-col items-center space-y-6 p-4"
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
