import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FactoryIcon from "@mui/icons-material/Factory";
import StoreIcon from "@mui/icons-material/Store";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import LogoutIcon from "@mui/icons-material/Logout";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import { Outlet, useNavigate } from "react-router-dom";

const drawerWidth = 260;

const SidebarLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleCategoryClick = () => {
    setOpenCategories(!openCategories);
  };

  const topMenu = [
    { text: "Manufacturer", icon: <FactoryIcon />, path: "/app/manufacturer" },
    { text: "Distributor", icon: <StoreIcon />, path: "/app/distributor" },
    { text: "Retailer", icon: <LocalShippingIcon />, path: "/app/retailer" },
    { text: "Brands", icon: <LoyaltyIcon />, path: "/app/brand" },
  ];

  const categorySubMenu = [
    { text: "Age Group", path: "/app/categories/age-group" },
    { text: "Skill", path: "/app/categories/skill" },
    { text: "Category", path: "/app/categories/category" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const bottomMenu = [
    {
      text: "Profile",
      icon: <AccountCircleIcon />,
      path: "/app/profile",
      type: "filled",
    },
    { text: "Logout", icon: <LogoutIcon />, onClick: handleLogout, type: "outlined" },
  ];

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Box>
        <Toolbar>
          <Typography
            variant="h4"
            sx={{
              paddingTop: 2,
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Flicks
          </Typography>
        </Toolbar>

        {/* Top Navigation */}
        <Box>
          <List>
            {topMenu.map(({ text, icon, path }) => (
              <ListItemButton
                key={text}
                onClick={() => navigate(path)}
                sx={{
                  mx: 2,
                  mb: 1,
                  borderRadius: 3,
                  backgroundColor: "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            ))}

            {/* Categories Dropdown */}
            <ListItemButton
              onClick={handleCategoryClick}
              sx={{
                mx: 2,
                mb: 1,
                borderRadius: 3,
                backgroundColor: "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText
                primary="Categories"
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
              {openCategories ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={openCategories} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categorySubMenu.map(({ text, path }) => (
                  <ListItemButton
                    key={text}
                    sx={{
                      pl: 6,
                      mb: 0.5,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    onClick={() => navigate(path)}
                  >
                    <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                      <StarBorder fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
        </Box>
      </Box>

      <Divider sx={{ mx: 2, mb: 2 }} />

      {/* Bottom Actions */}
      <Box>
        <List>
          {bottomMenu.map(({ text, icon, path, onClick, type }) => (
            <ListItemButton
              key={text}
              onClick={onClick || (() => navigate(path))}
              sx={{
                mx: 2,
                mb: 1.2,
                borderRadius: 3,
                border:
                  type === "outlined"
                    ? `2px solid ${theme.palette.primary.main}`
                    : "none",
                backgroundColor:
                  type === "filled"
                    ? theme.palette.primary.main
                    : "transparent",
                color:
                  type === "filled"
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor:
                    type === "filled"
                      ? theme.palette.primary.dark
                      : theme.palette.action.hover,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    type === "filled"
                      ? theme.palette.primary.contrastText
                      : theme.palette.primary.main,
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile Drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Desktop Drawer */}
        {!isMobile && (
          <Drawer
            variant="permanent"
            open
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                borderRight: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.paper,
          minHeight: "100vh",
        }}
      >
        {/* Mobile AppBar */}
        {isMobile && (
          <AppBar
            position="fixed"
            color="primary"
            sx={{ zIndex: theme.zIndex.drawer + 1 }}
          >
            <Toolbar>
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                Dashboard
              </Typography>
            </Toolbar>
          </AppBar>
        )}

        <Box sx={{ p: 2, mt: isMobile ? 8 : 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarLayout;
