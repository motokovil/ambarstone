import React, { useState, useEffect, useCallback } from "react"
import { useCookies } from "react-cookie";

//MATERIAL UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {Button, Box, Chip} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { toast, ToastContainer } from "react-toastify";
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

const jwt = require('jsonwebtoken')

const useStyles = makeStyles({
    root: {
        minWidth: 200,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    border: {
        borderRadius: "5px"
    }
});

export default function Usuarios() {

    const classes = useStyles();
    const backend = "https://newsletter8.herokuapp.com/"
    const proxy = "https://cryptic-cors864.herokuapp.com/"

    //Hooks
    const [, setIsSuper] = useState({ superuser: null })
    const [cookies] = useCookies(['token']);
    const [, setUser] = useState({})
    const [users, setusers] = useState([])
    const [data, setData] = useState({})


    const auth = (token) => {
        try {
            let access = jwt.verify(token, 'motk')
            if (access.user_id) {
                fetch(backend+"api/v1/users/" + access.user_id + "/", {
                    method: "GET",
                    headers: { 
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + token, 
                    }
                })
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
        }
    }

    const getUsers = useCallback(
        () => {
            fetch( proxy + backend+"api/v1/users/", {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + cookies.token,
                    }
                })
                .then(res => res.json())
                .then(res => {
                    setusers(res.results)
                    setData(res)
                })
                .catch(error => console.log(error))
        }, [cookies.token],
    )

    const nextPag = (next) => {
		if (next !== null) {
			fetch( proxy + next, {
				method: "GET",
				headers: {
					"Content-type": "application/json",
					"Authorization": "Bearer " + cookies.token,
				}
			})
			.then(res => res.json())
			.then(res => {
				setusers(res.results)
				setData(res)
			})
			.catch(err=>console.log(err))
		}else{
			toast.error("Last page")
		}
	}

    const setSuper = (user) => {

        fetch(  backend + "api/v1/users/" + user.id + "/super/", {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + cookies.token,
            },
            body: JSON.stringify({
                "is_superuser": !user.is_superuser})
        })
        .then(() => {
            getUsers()
            toast("¡Cambios realizados!",{
                className: "heyou",
                draggable: true,
                position: toast.POSITION.TOP_CENTER
            })
        })
        .catch(err => {
            
            toast.error(err)
        })
    }

    const deleteUser = (id) => {
		fetch(proxy + backend + "api/v1/users/"+id+"/", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer "+cookies.token,
            }
		})
		.then(() => getUsers())
		.catch(err=>console.log(err))
	}

    useEffect(() => {
        auth(cookies.token)
        getUsers()
    }, [cookies.token, getUsers])

    return (
        <Box>
            <ToastContainer/>
            <Box
			p={1}
			borderRadius={5}
			bgcolor="hsla(0,0%,90%)"
			mb={2}
			>
				<Grid container spacing={2}>
					<Grid item>
	
                        <Chip
                        icon={<PermIdentityIcon/>}
                        label={"Usuarios: " + data.count}
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
            <Grid container spacing={2} > 
            {
                users.map(item => (
                    <Grid item key={item.id}>
                    <Card className={classes.root} variant="outlined">
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                            {item.is_superuser ? "Super User" : "User"}
                            </Typography>
                            <Typography variant="h5" component="h2">
                            {item.username}
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                            {item.email}
                            </Typography>
                            
                        </CardContent>
                        <CardActions>
                            <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={()=>deleteUser(item.id)}
                            >
                                Delete
                            </Button>
                            <FormControlLabel
                                control={
                                <Switch
                                    checked={item.is_superuser}
                                    onChange={()=>setSuper(item)}
                                    name="checkedB"
                                    color="primary"
                                />
                                }
                                label="Super"
                            />
                        </CardActions>
                    </Card>
                    </Grid>
                ))
            } 
            </Grid>
        </Box>
    )
}