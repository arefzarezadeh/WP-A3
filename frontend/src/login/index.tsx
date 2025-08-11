import { Box, Button, Flex, Input, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { login, signup } from "../api/apicalls";
import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await login({username: username, password: password});
      navigate('/');
    } catch (err: any) {
      if (err.response && err.response.data) {
        toaster.create({
          description: "Login failed: " + err.response.data,
          type: "error",
        });
      } else {
        toaster.create({
          description: "Login failed: Unknown error",
          type: "error",
        });
      }
    }
  };

  const handleSignup = async () => {
    try {
      await signup({username: username, password: password});
      navigate('/');
    } catch (err: any) {
      if (err.response && err.response.data) {
        toaster.create({
          description: "Sign Up failed: " + err.response.data,
          type: "error",
        });
      } else {
        toaster.create({
          description: "Sign Up failed: Unknown error",
          type: "error",
        });
      }
    }
  };

  return (
    <Box h="100vh">
      <Flex direction="column" justify="center" align="center" h="100%">
        <Stack w="30%" align="center" padding="10" backgroundColor="colorPalette.100" borderRadius="lg" shadow="md">
          <Input onChange={(e) => setUsername(e.target.value)} />
          <Input onChange={(e) => setPassword(e.target.value)} type="password" />
          <Flex justify="space-around" w="100%">
            <Button onClick={handleSignup}>Sign Up</Button>
            <Button onClick={handleLogin}>Log In</Button>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Login;