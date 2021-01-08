import React, { useState, useEffect, useCallback } from 'react';
import { 
	Switch, 
	Link, 
	BrowserRouter as Router, 
	Route,
	useRouteMatch,
	useHistory
	// useParams
} from "react-router-dom";
import { useCookies } from "react-cookie";
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import Avatar from '@material-ui/core/Avatar';

//SubComponentes
import Boletines from "./admin/boletines";
import Usuarios from "./admin/usuarios";

const jwt = require('jsonwebtoken')

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	},
	appBar: {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
		justifyContent: 'flex-end',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
	link: {
		textDecoration: 'none',
		color: 'inherit'
	},
	title: {
		flexGrow: 1
	}
}));

export default function PersistentDrawerLeft() {
	const classes = useStyles();
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const history = useHistory()
	const [, setIsSuper] = useState({ superuser: null })
	const [cookies] = useCookies(['token']);
	const [user, setUser] = useState({})
	
	let match = useRouteMatch();

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const auth = useCallback(
		(token) => {
			try {
				let access = jwt.verify(token, 'motk')
				if (access.user_id) {
					fetch("http://localhost:8000/users/" + access.user_id + "/")
						.then(data => data.json())
						.then(user => {
							console.log("Logged in")
							setIsSuper({ superuser: user.is_superuser })
							setUser(user)
						})
						.catch(error => console.log(error))
				}

			} catch (error) {
				console.log("No has iniciado sesión: ", error.message)
				history.push("/Login")
				window.location.reload()
			}
		}, [history]
	)

	useEffect(() => {
		auth(cookies.token)
	}, [cookies.token, auth])

	return (
		<Router>
			<div className={classes.root}>
				<CssBaseline />
				<AppBar
					position="fixed"
					className={clsx(classes.appBar, {
						[classes.appBarShift]: open,
					})}
				>
					<Toolbar>

						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={handleDrawerOpen}
							edge="start"
							className={clsx(classes.menuButton, open && classes.hide)}
						>
							<MenuIcon />
						</IconButton>

						<Typography className={classes.title} variant="h6" noWrap>
							{user.username}
						</Typography>

						<Avatar>

						</Avatar>

					</Toolbar>
				</AppBar>

				<Drawer
					className={classes.drawer}
					variant="persistent"
					anchor="left"
					open={open}
					classes={{
						paper: classes.drawerPaper,
					}}
				>
					<div className={classes.drawerHeader}>
						<IconButton color="primary" onClick={handleDrawerClose}>
							{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
						</IconButton>
					</div>
					<Divider />
					<List>
						<ListItem button >
							<ListItemIcon>
								<MailIcon />
							</ListItemIcon>
							<Link className={classes.link} to={`${match.url}/Boletines`}>
								<ListItemText primary="Boletines" />
							</Link>
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem button >
							<ListItemIcon>
								<MailIcon />
							</ListItemIcon>
							<Link className={classes.link} to={`${match.url}/Usuarios`}>
								<ListItemText primary="Usuarios" />
							</Link>
						</ListItem>
					</List>
				</Drawer>

				<main
					className={clsx(classes.content, {
						[classes.contentShift]: open,
					})}
				>
					<div className={classes.drawerHeader} />
					{
						<Switch>
							<Route path={`${match.url}/Boletines`} component={Boletines} />
							<Route path={`${match.url}/Usuarios`} component={Usuarios}/>
						</Switch>
					}
				</main>
			</div>
		</Router>
	);
}