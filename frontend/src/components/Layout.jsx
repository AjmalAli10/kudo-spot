import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  EmojiEvents as KudosIcon,
  Analytics as AnalyticsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useUser } from "../context/UserContext";

function Layout({ children }) {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  if (!currentUser) {
    return children;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.8,
              },
            }}
            onClick={handleLogoClick}
          >
            KudoSpot
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<DashboardIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                color:
                  location.pathname === "/dashboard"
                    ? "#fff"
                    : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              startIcon={<KudosIcon />}
              onClick={() => navigate("/give-kudos")}
              sx={{
                color:
                  location.pathname === "/give-kudos"
                    ? "#fff"
                    : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Give Kudos
            </Button>
            <Button
              color="inherit"
              startIcon={<AnalyticsIcon />}
              onClick={() => navigate("/analytics")}
              sx={{
                color:
                  location.pathname === "/analytics"
                    ? "#fff"
                    : "rgba(255, 255, 255, 0.7)",
              }}
            >
              Analytics
            </Button>
            <Typography variant="body1" sx={{ mx: 2 }}>
              {currentUser.name}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
