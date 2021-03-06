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
import { Grid, Box, IconButton, TextField, Chip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { Delete } from "@material-ui/icons";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Alert from '@material-ui/lab/Alert';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import BookIcon from '@material-ui/icons/Book';

//selectFilter
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {toast, ToastContainer } from 'react-toastify';

//Router
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme)=>({
	imagen:{
		width:'40%',
		Height: '100%',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
	},
	root: {
		minWidth: 200,
		display: 'flex',
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
	const backend = "https://newsletter8.herokuapp.com/"

	//Hooks
	const [user, setUser] = useState({})
	const [users, setUsers] = useState([])
    const [cookies] = useCookies(['token']);
	const [boletines, setboletines] = useState([])
	const [boletinForm, setboletinForm] = useState({});
	const [boletin, setBoletin] = useState({})
	const [ModalPost, setModalPost] = useState(false);
	const [openMPatch, setModalPatch] = useState(false)
	const [filter, setfilter] = useState("ALL");
	const [data, setData] = useState({})

	const onChangeInput = (event) => {
        setboletinForm({...boletinForm, [event.target.name] : event.target.value });
	}

	const auth = useCallback(
	
	(token) => {
        try {
            let access = jwt.verify(token, 'motk')
            if(access.user_id){
                fetch(backend+"api/v1/users/"+access.user_id+"/", {
					method: "GET",
					headers: { 
						"Content-type": "application/json",
						"Authorization": "Bearer " + token, 
					}
				})
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

			fetch(backend+"api/v1/boletines/", {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer " + cookies.token,
				}
			})
			.then(res => res.json())
			.then(res=> {
				setboletines(res.results)
				setData(res)
			})
			.catch(error=>console.log(error))
		},
		[cookies.token],
	)

	const getUsers = useCallback(
		() => {
			fetch(backend+"api/v1/users/", {
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
		fetch(backend+"api/v1/boletines/", {
				method: "POST",
				body: JSON.stringify(boletinForm),
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer "+cookies.token,
				}
		})
		.then(res => res.json())
		.then(res=> {
			fetch(backend+"api/v1/boletines/"+res.id, {
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
		setboletinForm({...boletinForm, "editor" : user.id })
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
		fetch(backend+"api/v1/boletines/"+id+"/", {
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
		fetch(backend+"api/v1/boletines/"+id+"/", {
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

	const filterBoletines = useCallback(
		(filtro) => {
			if(filtro !== "ALL"){
				fetch(backend+"api/v1/boletines/?editor="+filtro, {
					method: "GET",
					headers: {
						"Content-type": "application/json",
						"Authorization": "Bearer " + cookies.token,
					}
				})
				.then(res => res.json())
				.then(res=> {
					setboletines(res.results)
					setData(res)
				})
				.catch(error=>console.log(error))
			}
		},[cookies.token]
	)

	const handleFilter = (event) => {
		setfilter(event.target.value);
		
	}

	const nextPag = (next) => {
		if (next !== null) {
			fetch(next, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer " + cookies.token,
				}
			})
			.then(res => res.json())
			.then(res => {
				setboletines(res.results)
				setData(res)
			})
			.catch(err=>console.log(err))
		}else{
			toast.error("Last page")
		}
	}

	useEffect(()=>{
		auth(cookies.token)
		getBoletines()
		getUsers()
		filterBoletines(filter)
	},[cookies.token, getBoletines,auth, getUsers,filter, filterBoletines])

	return (
		<Box>
			<ToastContainer/>
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
							<Button
							onClick={()=>setfilter("ALL")}
							>All</Button>
							<Button
							onClick={()=>setfilter(user.id)}
							>own</Button>
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
							<MenuItem value="ALL">
								<em>ALL</em>
							</MenuItem>
							{
								users.map(user => (
									<MenuItem key={user.id} value={user.id}>
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
				<Grid container spacing={2}>
					<Grid item>
						<Chip
						icon={<BookIcon/>}
						label={"Boletines: " + data.count}
						color="primary"
						/>
					</Grid>

					{data.next === null? 
						<Grid item>
							<Button 
							size="small" 
							variant="contained"
							disabled
							>
								Next
							</Button>
						</Grid>
					:
						<Grid item>
							<Button 
							size="small" 
							color="primary" 
							variant="contained"
							onClick={()=>nextPag(data.next)}
							>
								Next
							</Button>
						</Grid>
						}

						{data.previous === null?
							<Grid item>
								<Button
								size="small" 
								variant="contained"
								disabled
								> 
									Prev
								</Button>
							</Grid>
						:
							<Grid item>
								<Button 
								size="small" 
								color="primary" 
								variant="contained"
								onClick={()=>nextPag(data.previous)}
								>
									Prev
								</Button>
							</Grid>
						}
				</Grid>
			</Box>

			<Grid container spacing={2}>
			{boletines.length === 0?
			<Grid item>
				<Alert severity="error">No hay boletines disponibles.</Alert>
			</Grid>: 
			boletines.map(item => (
				<Grid item key={item.id} xs={12} md={6} lg={4}>
					<Card className={classes.root}>
						<CardActionArea >
							
							<CardContent className={classes.content} onClick={()=>boletinState(item)}>
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

							<CardActions>
								<IconButton onClick={(event)=>{deleteBoletin(event, item.id)}} color="primary">
									<Delete/>
								</IconButton>
								<Button 
								size="small" 
								variant="contained"
								color="primary">
								Learn More
								</Button>
							</CardActions>
						</CardActionArea>
						<CardMedia
						className={classes.imagen}
						component="img"
						alt="Contemplative Reptile"
						image={item.imagen}
						/>
	
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