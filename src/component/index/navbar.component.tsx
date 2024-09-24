// Import necessary libraries and components
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';

// Styled components for search input
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(''); // Track the search query
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isDropdownMenuOpen = Boolean(menuAnchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
    setMenuAnchorEl(null);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    menuSetter: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  ) => {
    menuSetter(event.currentTarget);
  };

  // Navigate to the search results page on "Enter"
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?query=${searchQuery.trim()}`);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderMenu = (
    menuId: string,
    anchor: HTMLElement | null,
    items: { label: string; action: () => void; path: string }[]
  ) => (
    <Menu
      anchorEl={anchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchor)}
      onClose={handleMenuClose}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            navigate(item.path);
            item.action();
          }}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );

  const accountMenuItems = [
    { label: 'login', action: handleMenuClose, path: '/login' },
    { label: 'register', action: handleMenuClose, path: '/register' },
  ];

  const dropdownMenuItems = [
    { label: 'Shop', action: handleMenuClose, path: '/shop' },
    { label: 'Cart', action: handleMenuClose, path: '/cart' },
    { label: 'Setting', action: handleMenuClose, path: '/setting' },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: scrolled ? 'rgb(55, 162, 245)' : 'transparent',
          transition: 'background-color 0.3s ease',
          boxShadow: scrolled ? 4 : 'none',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            FANTASY_OCEAN
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state
              onKeyPress={handleSearchKeyPress} // Capture "Enter" key press
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Mail">
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                sx={{
                  '&:focus': { outline: 'none', boxShadow: 'none' },
                  '&:active': { outline: 'none', boxShadow: 'none' },
                }}
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
                sx={{
                  '&:focus': { outline: 'none', boxShadow: 'none' },
                  '&:active': { outline: 'none', boxShadow: 'none' },
                }}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={(e) => handleMenuOpen(e, setAnchorEl)}
                color="inherit"
                sx={{
                  '&:focus': { outline: 'none', boxShadow: 'none' },
                  '&:active': { outline: 'none', boxShadow: 'none' },
                }}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="Dropdown Menu">
              <IconButton
                size="large"
                edge="end"
                aria-label="open dropdown menu"
                aria-controls="primary-search-menu-dropdown"
                aria-haspopup="true"
                onClick={(e) => handleMenuOpen(e, setMenuAnchorEl)}
                color="inherit"
                sx={{
                  '&:focus': { outline: 'none', boxShadow: 'none' },
                  '&:active': { outline: 'none', boxShadow: 'none' },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
              onClick={(e) => handleMenuOpen(e, setMobileMoreAnchorEl)}
              color="inherit"
              sx={{
                '&:focus': { outline: 'none', boxShadow: 'none' },
                '&:active': { outline: 'none', boxShadow: 'none' },
              }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu('primary-search-account-menu', anchorEl, accountMenuItems)}
      {renderMenu('primary-search-account-menu-mobile', mobileMoreAnchorEl, accountMenuItems)}
      {renderMenu('primary-search-menu-dropdown', menuAnchorEl, dropdownMenuItems)}
    </Box>
  );
}
