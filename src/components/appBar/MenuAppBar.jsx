import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";

export default function MenuAppBar() {
  const { logout } = React.useContext(AuthContext)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    handleClose()
    logout();
  }
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleGeneralMenu = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };
  const changeRouter = (router) => {
    navigate("/"+router);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>

      <AppBar position="static" sx={{ backgroundColor: '#16AB05' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleGeneralMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LogCycle
          </Typography>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>SAIR</MenuItem>
          </Menu>
          <Menu
            id="menu-appbar"
            anchorEl={anchorE2}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorE2)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => changeRouter("maps")}>Home</MenuItem>
            <MenuItem onClick={() => changeRouter("collection-box-form")}>Cadastro de PEV</MenuItem>
            <MenuItem onClick={() => changeRouter("check-box")}>Identificar Item</MenuItem>
          </Menu>

        </Toolbar>
      </AppBar>
    </Box>
  );
}
