import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuth();

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" color="secondary" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "primary.main",
            fontWeight: "bold",
          }}
        >
          Organize
        </Typography>
        <Box>
          <Button component={Link} to="/home" color="inherit">
            Home
          </Button>
          {userInfo ? (
            <>
              <Button component={Link} to="/my-tickets" color="inherit">
                Tiket Saya
              </Button>
              <Button component={Link} to="/my-events" color="inherit">
                Acara Saya
              </Button>
              <Button component={Link} to="/profile" color="inherit">
                Profil Saya
              </Button>
              <Button
                onClick={logoutHandler}
                color="primary"
                variant="contained"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                color="primary"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
