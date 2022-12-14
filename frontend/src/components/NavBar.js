import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import Logo from "../assets/logo.png";
import { UserContext } from "../context/UserContext";

const Container = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  padding: "20px 10%",
});

const NavButton = styled(Button)({
  color: "black",
  backgroundColor: "white",
  fontFamily: "Roboto, sans-serif",
  "&:hover": {
    backgroundColor: "white",
    textDecoration: "underline",
  },
});

const TextContainer = styled("div")({
  display: "flex",
  gap: "20px",
});

const Icon = styled("img")({
  "&:hover": {
    cursor: "pointer",
  },
});

const NavBar = (props) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  // log user out when user selects "Log out"
  const handleLogout = () => {
    setUser(null);
  };

  // render navigation bar for logged in user
  if (user) {
    return (
      <Container>
        <Icon src={Logo} width="75px" onClick={() => navigate("/")}></Icon>
        <TextContainer>
          <NavButton disableRipple variant="text" onClick={handleLogout}>
            Log Out
          </NavButton>
        </TextContainer>
      </Container>
    );
  } else {
    // render navigation bar for gues user (not logged in)
    return (
      <Container>
        <Icon src={Logo} width="75px" onClick={() => navigate("/")}></Icon>
        <TextContainer>
          <NavButton variant="text" onClick={() => navigate("/register")}>
            Create Account
          </NavButton>
          <NavButton variant="text" onClick={() => navigate("/login")}>
            Log In
          </NavButton>
        </TextContainer>
      </Container>
    );
  }
};
export default NavBar;
