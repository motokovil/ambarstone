import React, {useState, useEffect, useCallback} from "react"
import {useCookies} from "react-cookie";

//MATERIAL UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid, Box, IconButton, TextField } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { Delete } from "@material-ui/icons";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Alert from '@material-ui/lab/Alert';
import ButtonGroup from '@material-ui/core/ButtonGroup';

//selectFilter
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

//Router
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme)=>({
	root: {
		maxWidth: 200,
	},
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
})); 

const jwt = require('jsonwebtoken')
const moment = require('moment')

export default function Boletines(){

	const classes = useStyles();
	const history = useHistory();

	//Hooks
	const [user, setUser] = useState({})
	const [users, setUsers] = useState([])
    const [cookies] = useCookies(['token']);
	const [boletines, setboletines] = useState([])
	const [boletinForm, setboletinForm] = useState({});
	const [boletin, setBoletin] = useState({})
	const [ModalPost, setModalPost] = useState(false);
	const [openMPatch, setModalPatch] = useState(false)
	const [filter, setfilter] = useState("");

	const onChangeInput = (event) => {
        setboletinForm({...boletinForm, [event.target.name] : event.target.value });
	}

	const auth = useCallback(
	
	(token) => {
        try {
            let access = jwt.verify(token, 'motk')
            if(access.user_id){
                fetch("http://localhost:8000/users/"+access.user_id+"/")
                .then(data=>data.json())
                .then(user=>{
                    console.log("Logged in")
					setUser(user)
                })
				.catch(error=>console.log(error))
            }

        } catch (error) {
			console.log("No has iniciado sesión: ", error.message)
			history.push("/Login")
			window.location.reload()
        }
		}, [history]
	);

	const getBoletines = useCallback(
		() => {

			fetch("http://localhost:8000/boletines/", {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer "+cookies.token,
				}
			})
			.then(res => res.json())
			.then(res=> setboletines(res.results))
			.catch(error=>console.log(error))
		},
		[cookies.token],
	)

	const getUsers = useCallback(
		() => {
			fetch("http://localhost:8000/users/", {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer "+cookies.token,
				}
			})
			.then(res => res.json())
			.then(res=> setUsers(res.results))
			.catch(error=>console.log(error))
		},
		[cookies.token],
	)

	const postBoletin = (event) => {
		event.preventDefault()
		fetch("http://localhost:8000/boletines/", {
				method: "POST",
				body: JSON.stringify(boletinForm),
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer "+cookies.token,
				}
		})
		.then(res => res.json())
		.then(res=> {
			fetch("http://localhost:8000/boletines/"+res.id+"/setautor/", {
				method: "POST",
				body: JSON.stringify({
					"autor_id": user.id
				}),
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer "+cookies.token,
				}
			})
			.then(res => res.json())
			.then(res => {
				handleCloseMPost()
				getBoletines()
			})
			.catch(err => console.log(err))
		})
		.catch(error=>console.log(error))
	}

	const handleOpenMPost = () => {
		setModalPost(true);
	};

	const handleCloseMPost = () => {
		setModalPost(false);
	};

	const handleOpenMPatch = () => {
		setModalPatch(true);
	};

	const handleCloseMPatch = () => {
		setModalPatch(false);
	};

	const boletinState = (boletin) => {
		handleOpenMPatch()
		setBoletin(boletin)
	}

	const deleteBoletin = (event, id) => {
		event.preventDefault()
		fetch("http://localhost:8000/boletines/"+id, {
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer "+cookies.token,
				}
		})
		.then(() => getBoletines())
		.catch(err=>console.log(err))
	}

	const patchBoletin = (event, id) => {
		event.preventDefault()
		fetch("http://localhost:8000/boletines/"+id+"/", {
				method: "PATCH",
				body: JSON.stringify(boletinForm),
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer "+cookies.token,
				}
		})
		.then(res => res.json())
		.then(res => {
			handleCloseMPatch()
			getBoletines()
		})
		.catch(err => console.log(err))
	}

	const handleFilter = (event) => {
		setfilter(event.target.value);
	}

	useEffect(()=>{
		auth(cookies.token)
		getBoletines()
		getUsers()
	},[cookies.token, getBoletines,auth, getUsers])

	return (
		<Box>
			<Box
			p={1}
			borderRadius={5}
			bgcolor="hsla(0,0%,90%)"
			mb={2}
			>
				<Grid container alignItems="center" spacing={2}>
					<Grid item>
						<IconButton onClick={handleOpenMPost} color="primary" aria-label="Agrega un boletín">
							<AddIcon/>
						</IconButton>
					</Grid>
					<Grid item>
						<ButtonGroup variant="contained" color="primary" aria-label="outlined primary button group">
							<Button>All</Button>
							<Button>own</Button>
						</ButtonGroup>
					</Grid>
					<Grid>
					<FormControl color="primary" size="small" variant="outlined" className={classes.formControl}>
						<InputLabel id="demo-simple-select-outlined-label">Autor</InputLabel>
						<Select
						onChange={handleFilter}
						label="Autor"
						value={filter}
						>
							<MenuItem value="None">
								<em>None</em>
							</MenuItem>
							{
								users.map(user => (
									<MenuItem key={user.id} value={user.username}>
										{user.username}
									</MenuItem>
								))
							}
							
						</Select>
					</FormControl>
					</Grid>
				</Grid>
			</Box>

			<Box
			p={1}
			borderRadius={5}
			bgcolor="hsla(0,0%,90%)"
			mb={2}
			>

			</Box>

			<Grid container spacing={2}>
			{boletines[0] === null?
			<Grid item>
				<Alert severity="error">No hay boletines disponibles.</Alert>
			</Grid>: 
			boletines.map(item => (
				<Grid item key={item.id} >
					<Card className={classes.root}>
						<CardActionArea onClick={()=>boletinState(item)}>
							<CardMedia
							component="img"
							alt="Contemplative Reptile"
							height="140"
							image={item.imagen}
							/>
							<CardContent>
								<Typography gutterBottom variant="h6" component="h2">
									{item.titulo}
								</Typography>
								<Typography gutterBottom variant="body2" color="primary" component="p">
									{item.descripcion}
								</Typography>
								<Typography color="textSecondary" variant="caption">
								Created: {moment(item.created).fromNow()}
								<br/>
								Updated: {moment(item.updated).fromNow()}
								</Typography>
							</CardContent>
						</CardActionArea>
	
						<CardActions>
							<IconButton onClick={(event)=>{deleteBoletin(event, item.id)}} color="primary">
								<Delete/>
							</IconButton>
							<Button size="small" color="primary">
							Learn More
							</Button>
						</CardActions>
					</Card>
				</Grid>
			))}
			<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			className={classes.modal}
			open={openMPatch}
			onClose={handleCloseMPatch}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
			timeout: 500,
			}}
			>
			<Fade in={openMPatch}>
				<Box
				width="80vw"
				maxWidth="350px"
				
				p={2}
				bgcolor="white"
				borderRadius={5}
				>
					<form
					onInput={onChangeInput}
					onSubmit={(event)=>{patchBoletin(event ,boletin.id)}}
					>
						<Box
							bgcolor='white'
							display= 'flex'
							flexDirection= 'column'
							padding= '20px'
							borderRadius= '5px'
						>
							<Box
							pb={3}
							>
								<Typography variant="h4" color="primary">
									{boletin.titulo}
								</Typography>
								<Typography color="textSecondary" variant="caption">
									Agrega un nuevo boletín.
								</Typography>
							</Box>

							<TextField
								label="Titulo"
								id="titulo"
								name="titulo"
								variant="outlined"
								size="small"
								margin="normal"
								defaultValue={boletin.titulo}
								required
							/>

							<TextField
								id="descripcion"
								name="descripcion"
								label="Descripcion"
								defaultValue={boletin.descripcion}
								variant="outlined"
								size='small'
								multiline
								rows={4}
								margin="normal"
								required
							/>

							<TextField
								id="imagen"
								name="imagen"
								label="Imagen (URL)"
								type="url"
								variant="outlined"
								size='small'
								margin="normal"
								defaultValue={boletin.imagen}
								required
							/>

							<Button  
							variant="contained" 
							color="primary" 
							type="submit"
							>
								Actualizar
							</Button>
						</Box>
					</form>
				</Box>
			</Fade>
			</Modal>
			</Grid>

			<Modal
			aria-labelledby="transition-modal-title"
			aria-describedby="transition-modal-description"
			className={classes.modal}
			open={ModalPost}
			onClose={handleCloseMPost}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{
			timeout: 500,
			}}
			>
			<Fade in={ModalPost}>
				<Box
				width="80vw"
				maxWidth="350px"
				p={2}
				bgcolor="white"
				borderRadius={5}
				>
					<form 
					onInput={onChangeInput}
					onSubmit={postBoletin}
					>
						<Box
						bgcolor='white'
						display= 'flex'
						flexDirection= 'column'
						padding= '20px'
						borderRadius= '5px'
						>
							<Box
							pb={3}
							>
								<Typography variant="h4" color="primary">
									Nuevo Boletin
								</Typography>
								<Typography color="textSecondary" variant="caption">
									Agrega un nuevo boletín.
								</Typography>
							</Box>

							<TextField
								label="Titulo"
								id="titulo"
								name="titulo"
								variant="outlined"
								size="small"
								margin="normal"
								required
							/>

							<TextField
								id="descripcion"
								name="descripcion"
								label="Descripcion"
								
								variant="outlined"
								size='small'
								multiline
								rows={4}
								margin="normal"
								required
							/>

							<TextField
								id="imagen"
								name="imagen"
								label="Imagen (URL)"
								type="url"
								variant="outlined"
								size='small'
								margin="normal"
								required
							/>

							<Button  
							variant="contained" 
							color="primary" 
							type="submit"
							>
								Agregar
							</Button>
						</Box>
					</form>
				</Box>
			</Fade>
		</Modal>
		</Box>
	)
}