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

// Define a custom interface for components that require the 'checked' prop
interface CheckedProps {
  checked: boolean;
}

const Container = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  fontFamily: '"Jost", sans-serif',
  background: "linear-gradient(to bottom, #0f0c29, #302b63, #24243e)",
}));

const Main = styled(Box)(({ theme }) => ({
  width: 350,
  height: 550,
  overflow: "hidden",
  background:
    'url("https://doc-08-2c-docs.googleusercontent.com/docs/securesc/68c90smiglihng9534mvqmq1946dmis5/fo0picsp1nhiucmc0l25s29respgpr4j/1631524275000/03522360960922298374/03522360960922298374/1Sx0jhdpEpnNIydS4rnN4kHSJtU1EyWka?e=view&authuser=0&nonce=gcrocepgbb17m&user=03522360960922298374&hash=tfhgbs86ka6divo3llbvp93mg4csvb38") no-repeat center/cover',
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
          <StyledForm>
            <Typography component="label" htmlFor="chk">
              Sign up
            </Typography>
            <FormControl style={{ width: "100%" }}>
              <StyledInput
                type="text"
                name="username"
                placeholder="User name"
                required
              />
              <StyledInput
                type="email"
                name="email"
                placeholder="Email"
                required
              />
              <StyledInput
                type="text"
                name="accesskey"
                placeholder="Access key"
                required
              />
              <StyledInput
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </FormControl>
            <StyledButton type="submit">Sign up</StyledButton>
          </StyledForm>
        </Signup>

        <Login checked={checked}>
          <StyledForm>
            <Typography component="label" htmlFor="chk">
              Login
            </Typography>
            <FormControl style={{ width: "100%", marginTop: "100px" }}>
              <StyledInput
                type="text"
                name="username"
                placeholder="User Name"
                required
              />
              <StyledInput
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </FormControl>
            <StyledButton type="submit">Login</StyledButton>
          </StyledForm>
        </Login>
      </Main>
    </Container>
  );
}

export default Auth;
