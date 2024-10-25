import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Input,
  Typography,
  styled,
} from "@mui/material";
import { login, signup } from "../../services/authService";
import { createGeneralData } from "../../services/generalData";

interface CheckedProps {
  checked: boolean;
}

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  fontFamily: '"Jost", sans-serif',
  backgroundSize:
    "100% 100%" /* This ensures the image covers the entire div */,
  backgroundPosition: "center" /* This centers the image */,
  backgroundRepeat: "no-repeat" /* This prevents the image from repeating */,
  backgroundColor: "#1f1f1f",
}));

const Main = styled(Box)(({ theme }) => ({
  width: 350,
  height: 550,
  overflow: "hidden",
  background: "linear-gradient(to bottom, #100477, #5c4ef0, #24243e)",
  borderRadius: 10,
  boxShadow: "5px 20px 50px #000",
}));

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const StyledInput = styled(Input)({
  width: "80%",
  margin: "5px auto",
  padding: "5px 10px",
  borderRadius: 5,
  backgroundColor: "#e0dede",
  "&::before": {
    border: 0,
  },
  "&::after": {
    border: 0,
  },
  "&:hover:not(.Mui-disabled):not(.Mui-error)::before": {
    borderBottom: "0",
  },
});

const StyledButton = styled(Button)({
  width: "60%",
  margin: "10px auto 10px",
  color: "#fff",
  backgroundColor: "#573b8a",
  fontSize: "1em",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#6d44b8",
  },
});

const Login = styled(Box, {
  shouldForwardProp: (prop) => prop !== "checked",
})<CheckedProps>(({ theme, checked }) => ({
  height: 550,
  backgroundColor: "#eee",
  borderRadius: "60% / 10%",
  transform: checked ? "translateY(-125px)" : "translateY(-480px)",
  transition: "0.8s ease-in-out",
  "& label": {
    color: "#573b8a",
    transform: checked ? "scale(0.6)" : "scale(1)",
    transition: "transform 0.8s ease-in-out",
    fontSize: "2.3em",
    fontWeight: "bold",
    margin: "15px auto",
    cursor: "pointer",
  },
}));

const Signup = styled(Box, {
  shouldForwardProp: (prop) => prop !== "checked",
})<CheckedProps>(({ theme, checked }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  "& label": {
    color: "#fff",
    fontSize: "2.3em",
    fontWeight: "bold",
    margin: "15px auto",
    cursor: "pointer",
    transition: "transform 0.8s ease-in-out",
    transform: checked ? "scale(1)" : "scale(0.6)",
  },
}));

function Auth() {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const accesskey = formData.get("accesskey") as string;
    const password = formData.get("password") as string;

    try {
      const response = await signup(username, email, accesskey, password);
      const data = await createGeneralData(
        {
          A242: 0,
          D244: 0,
          accumulatedBalance: 0,
          CG4: 0,
          CH4: 0,
          E242: 0,
        },
        response.userId
      );
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("userId", response.userId);
      window.location.href = "/"; // Navigate to the general page
    } catch (error) {
      console.log(error);

      console.error("Signup error: ", error);
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await login(username, password);
      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("userId", response.userId);
      window.location.href = "/"; // Navigate to the general page
      // You can add further logic here after a successful login
    } catch (error) {
      console.error("Login error: ", error);
    }
  };

  return (
    <Container>
      <Main>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          id="chk"
          sx={{ display: "none" }}
        />
        <Signup checked={checked}>
          <StyledForm onSubmit={handleSignup}>
            <Typography component="label" htmlFor="chk">
              Sign up
            </Typography>
            <FormControl style={{ width: "100%" }}>
              <FormControl style={{ width: "100%" }}>
                <StyledInput
                  type="text"
                  name="username"
                  placeholder="User name"
                  required
                />
              </FormControl>
              <FormControl style={{ width: "100%" }}>
                <StyledInput
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </FormControl>
              <FormControl style={{ width: "100%" }}>
                <StyledInput
                  type="text"
                  name="accesskey"
                  placeholder="Access key"
                  required
                />
              </FormControl>
              <FormControl style={{ width: "100%" }}>
                <StyledInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </FormControl>
            </FormControl>
            <StyledButton type="submit">Sign up</StyledButton>
          </StyledForm>
        </Signup>

        <Login checked={checked}>
          <StyledForm onSubmit={handleLogin}>
            <Typography component="label" htmlFor="chk">
              Login
            </Typography>
            <FormControl style={{ width: "100%", marginTop: "100px" }}>
              <FormControl style={{ width: "100%" }}>
                <StyledInput
                  type="text"
                  name="username"
                  placeholder="User Name"
                  required
                />
              </FormControl>
              <FormControl style={{ width: "100%" }}>
                <StyledInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                />
              </FormControl>
            </FormControl>
            <StyledButton type="submit">Login</StyledButton>
          </StyledForm>
        </Login>
      </Main>
    </Container>
  );
}

export default Auth;
