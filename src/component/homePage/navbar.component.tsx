import * as React from 'react';
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
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null); // New state for dropdown menu
    const [scrolled, setScrolled] = React.useState(false);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isDropdownMenuOpen = Boolean(menuAnchorEl); // New state for dropdown menu

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleDropdownMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleDropdownMenuClose = () => {
        setMenuAnchorEl(null);
    };

    React.useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            setScrolled(offset > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="show 17 new notifications"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    // New dropdown menu items
    const dropdownMenuId = 'primary-search-menu-dropdown';
    const renderDropdownMenu = (
        <Menu
            anchorEl={menuAnchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            id={dropdownMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={isDropdownMenuOpen}
            onClose={handleDropdownMenuClose}
        >
            <MenuItem onClick={handleDropdownMenuClose}>Shop</MenuItem>
            <MenuItem onClick={handleDropdownMenuClose}>Cart</MenuItem>
            <MenuItem onClick={handleDropdownMenuClose}>Setting</MenuItem>
        </Menu>
    );

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
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        FANTASY_OCEAN
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Tooltip title="Mail">
                            <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                                <Badge badgeContent={4} color="error">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <IconButton
                                size="large"
                                aria-label="show 17 new notifications"
                                color="inherit">
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
                                aria-controls={menuId}
                                aria-haspopup="true"
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </Tooltip>
                        {/* Dropdown Menu Icon */}
                        <Tooltip title="Dropdown Menu">
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="open dropdown menu"
                                aria-controls={dropdownMenuId}
                                aria-haspopup="true"
                                onClick={handleDropdownMenuOpen}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <p> my sister did a little bit of keymash in this text a while ago. I would’ve deleted it, but nah, I didn’t feel like it. And besides, it’s not like it took up half this text. I have an estimate for how long it’ll take me to be the world record holder: about one month. I think I can manage one month of writing this. You know what? I’m just gonna break my rule of not saying the word “furry”. There, I said it. Now I’m allowing myself to write “furry” whenever I want. So with that out of the way, let’s talk about how I first became a furry. For some reason, I have the exact date when I became a furry memorized. It’s May 4, 2018. At that time, I discovered that I was a furry by watching some furry YouTube videos. I knew about the existence of furries years before this, but I didn’t know much about it until this time. I said to myself, “You know what? I’m a furry now,” and that’s what started it all. And I’ve been slowly learning more about the fandom ever since. I would like to participate more in the fandom when I’m older, but I’m too young for most of it right now. Guess I’ll just have to wait. But in the meantime, I can write about it in this text. I should sleep now. Goodnight. Hello, I'm back once again. Happy Pi Day! I memorized a bunch of digits of Pi once, not sure how many I still remember... I have literally nothing to write about now. I've been trying to come up with something for the past 10 minutes, and I still have no idea. Literally nothing is happening right now. It's pretty boring. My sister is watching Friends, as usual. Okay, since there's nothing for me to write about, I should go now. Bye! Wow, it has been a while since I last added to this. It is now July 10, 2019. Last time I edited this page was Pi Day, which was March 14. Those 4 months of this thing being untouched end today! Wait... 4 months? That means I was supposed to get this past the world record three months ago. Oh well. I have put many things into this text. A lot of them were cringy, like how I keep mentioning furry-related things. You know, I should stop putting things in here when I know I'm gonna cringe at them later. I'll try not to do that from here on out. I just know I'll fail though. I'd hate to be aware of someone reading this entire thing... like, if I had to sit and watch a family member or something read this entire text, I would cringe so hard. I would not want that to happen. I am currently pasting the entirety of the FlamingChicken LTE onto a page on OurWorldOfText. The frustrating thing about pasting stuff there is that it pastes one letter at a time, so it takes forever to paste long text. And when the tab isn't open, I'm pretty sure it just stops pasting, so you have to keep the tab open if you want it to continue. Why am I even doing this? No idea. I might not even paste the whole thing. I probably won't. Hey, I just had a thought. What if, in the future, students are reading this for a class assignment? What if this LTE becomes part of the school curriculum? If so, hi future student! I hope you're enjoying reading my CRINGE. What is my life coming to? That's enough writing for now. Goodbye. Hey again. Might as well continue writing in here for a bit. Hey, have you ever heard of 3D Movie Maker? It's a program from the 90s (that still works on modern computers) where you can make 3D animated movies. It's pretty cool. I've made a few movies with it myself, and many other people use it to make interesting stuff. In case you want to try it for yourself, I'm sure if you google "3dmm download" or something like that, it will take you somewhere where you can download the program. It's kinda aimed at younger children, but hopefully that doesn't stop you from making absolute masterpieces with this program. I have a keyboard in my room (the musical kind, not the one you type words on), and I don't really know how to play it properly, but I do it anyways. I can play a few songs on the piano (albeit with weird fingering because like I just said, I have no idea what I'm doing), including HOME - Resonance and PilotRedSun - Bodybuilder. You might not know one or both of those songs. If you don't know one of them, why not google it? You will have discovered some new music, and it will all be because of me. my sister did a little bit of keymash in this text a while ago. I would’ve deleted it, but nah, I didn’t feel like it. And besides, it’s not like it took up half this text. I have an estimate for how long it’ll take me to be the world record holder: about one month. I think I can manage one month of writing this. You know what? I’m just gonna break my rule of not saying the word “furry”. There, I said it. Now I’m allowing myself to write “furry” whenever I want. So with that out of the way, let’s talk about how I first became a furry. For some reason, I have the exact date when I became a furry memorized. It’s May 4, 2018. At that time, I discovered that I was a furry by watching some furry YouTube videos. I knew about the existence of furries years before this, but I didn’t know much about it until this time. I said to myself, “You know what? I’m a furry now,” and that’s what started it all. And I’ve been slowly learning more about the fandom ever since. I would like to participate more in the fandom when I’m older, but I’m too young for most of it right now. Guess I’ll just have to wait. But in the meantime, I can write about it in this text. I should sleep now. Goodnight. Hello, I'm back once again. Happy Pi Day! I memorized a bunch of digits of Pi once, not sure how many I still remember... I have literally nothing to write about now. I've been trying to come up with something for the past 10 minutes, and I still have no idea. Literally nothing is happening right now. It's pretty boring. My sister is watching Friends, as usual. Okay, since there's nothing for me to write about, I should go now. Bye! Wow, it has been a while since I last added to this. It is now July 10, 2019. Last time I edited this page was Pi Day, which was March 14. Those 4 months of this thing being untouched end today! Wait... 4 months? That means I was supposed to get this past the world record three months ago. Oh well. I have put many things into this text. A lot of them were cringy, like how I keep mentioning furry-related things. You know, I should stop putting things in here when I know I'm gonna cringe at them later. I'll try not to do that from here on out. I just know I'll fail though. I'd hate to be aware of someone reading this entire thing... like, if I had to sit and watch a family member or something read this entire text, I would cringe so hard. I would not want that to happen. I am currently pasting the entirety of the FlamingChicken LTE onto a page on OurWorldOfText. The frustrating thing about pasting stuff there is that it pastes one letter at a time, so it takes forever to paste long text. And when the tab isn't open, I'm pretty sure it just stops pasting, so you have to keep the tab open if you want it to continue. Why am I even doing this? No idea. I might not even paste the whole thing. I probably won't. Hey, I just had a thought. What if, in the future, students are reading this for a class assignment? What if this LTE becomes part of the school curriculum? If so, hi future student! I hope you're enjoying reading my CRINGE. What is my life coming to? That's enough writing for now. Goodbye. Hey again. Might as well continue writing in here for a bit. Hey, have you ever heard of 3D Movie Maker? It's a program from the 90s (that still works on modern computers) where you can make 3D animated movies. It's pretty cool. I've made a few movies with it myself, and many other people use it to make interesting stuff. In case you want to try it for yourself, I'm sure if you google "3dmm download" or something like that, it will take you somewhere where you can download the program. It's kinda aimed at younger children, but hopefully that doesn't stop you from making absolute masterpieces with this program. I have a keyboard in my room (the musical kind, not the one you type words on), and I don't really know how to play it properly, but I do it anyways. I can play a few songs on the piano (albeit with weird fingering because like I just said, I have no idea what I'm doing), including HOME - Resonance and PilotRedSun - Bodybuilder. You might not know one or both of those songs. If you don't know one of them, why not google it? You will have discovered some new music, and it will all be because of me. my sister did a little bit of keymash in this text a while ago. I would’ve deleted it, but nah, I didn’t feel like it. And besides, it’s not like it took up half this text. I have an estimate for how long it’ll take me to be the world record holder: about one month. I think I can manage one month of writing this. You know what? I’m just gonna break my rule of not saying the word “furry”. There, I said it. Now I’m allowing myself to write “furry” whenever I want. So with that out of the way, let’s talk about how I first became a furry. For some reason, I have the exact date when I became a furry memorized. It’s May 4, 2018. At that time, I discovered that I was a furry by watching some furry YouTube videos. I knew about the existence of furries years before this, but I didn’t know much about it until this time. I said to myself, “You know what? I’m a furry now,” and that’s what started it all. And I’ve been slowly learning more about the fandom ever since. I would like to participate more in the fandom when I’m older, but I’m too young for most of it right now. Guess I’ll just have to wait. But in the meantime, I can write about it in this text. I should sleep now. Goodnight. Hello, I'm back once again. Happy Pi Day! I memorized a bunch of digits of Pi once, not sure how many I still remember... I have literally nothing to write about now. I've been trying to come up with something for the past 10 minutes, and I still have no idea. Literally nothing is happening right now. It's pretty boring. My sister is watching Friends, as usual. Okay, since there's nothing for me to write about, I should go now. Bye! Wow, it has been a while since I last added to this. It is now July 10, 2019. Last time I edited this page was Pi Day, which was March 14. Those 4 months of this thing being untouched end today! Wait... 4 months? That means I was supposed to get this past the world record three months ago. Oh well. I have put many things into this text. A lot of them were cringy, like how I keep mentioning furry-related things. You know, I should stop putting things in here when I know I'm gonna cringe at them later. I'll try not to do that from here on out. I just know I'll fail though. I'd hate to be aware of someone reading this entire thing... like, if I had to sit and watch a family member or something read this entire text, I would cringe so hard. I would not want that to happen. I am currently pasting the entirety of the FlamingChicken LTE onto a page on OurWorldOfText. The frustrating thing about pasting stuff there is that it pastes one letter at a time, so it takes forever to paste long text. And when the tab isn't open, I'm pretty sure it just stops pasting, so you have to keep the tab open if you want it to continue. Why am I even doing this? No idea. I might not even paste the whole thing. I probably won't. Hey, I just had a thought. What if, in the future, students are reading this for a class assignment? What if this LTE becomes part of the school curriculum? If so, hi future student! I hope you're enjoying reading my CRINGE. What is my life coming to? That's enough writing for now. Goodbye. Hey again. Might as well continue writing in here for a bit. Hey, have you ever heard of 3D Movie Maker? It's a program from the 90s (that still works on modern computers) where you can make 3D animated movies. It's pretty cool. I've made a few movies with it myself, and many other people use it to make interesting stuff. In case you want to try it for yourself, I'm sure if you google "3dmm download" or something like that, it will take you somewhere where you can download the program. It's kinda aimed at younger children, but hopefully that doesn't stop you from making absolute masterpieces with this program. I have a keyboard in my room (the musical kind, not the one you type words on), and I don't really know how to play it properly, but I do it anyways. I can play a few songs on the piano (albeit with weird fingering because like I just said, I have no idea what I'm doing), including HOME - Resonance and PilotRedSun - Bodybuilder. You might not know one or both of those songs. If you don't know one of them, why not google it? You will have discovered some new music, and it will all be because of me.</p>
            {renderDropdownMenu}
            {renderMenu}
            {renderMobileMenu}
        </Box>
    );
}
