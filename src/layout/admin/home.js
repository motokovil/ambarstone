import { Box, Grid, Typography} from "@material-ui/core";
import React, { useState, useEffect, useCallback } from 'react';
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const jwt = require('jsonwebtoken')

const useStyles = makeStyles((theme)=>({
    typo: {
        color: 'hsla(0,100%,100%, .8)'
    },
    typoLight: {
        color: 'hsla(0,100%,100%, .9)',
        fontStyle: 'bold'

    }
}))

export default function Home_Admin(){
    const [cookies] = useCookies(['token']);
    const [user, setUser] = useState({})
    const [suscripciones, setSuscrip] = useState([])
    const backend = "https://newsletter8.herokuapp.com/"
    const history = useHistory()
    const classes = useStyles()

    const auth = useCallback(
		(token) => {
			try {
				let access = jwt.verify(token, 'motk')
				if (access.user_id) {
					fetch(backend + "api/v1/users/" + access.user_id + "/")
					.then(data => data.json())
					.then(user => {
						console.log("Logged in")
                        setUser(user)
                        fetch(backend + "api/v1/users/" + user.id + "/suscripciones/")
                        .then(res=>res.json())
                        .then(res => {
                            console.log(res)
                            setSuscrip(res)
                        })
                        
					})
					.catch(error => console.log(error))
				}

			} catch (error) {
				console.log("No has iniciado sesión: ", error.message)
				history.push("/Login")
				
			}
		}, [history]
    )
    
    useEffect(() => {
		auth(cookies.token)
	}, [cookies.token, auth])

    return (
        <Box>

            <Box 
                bgcolor="primary.dark"
                p={2}
                borderRadius={5}
                mb={1}
            >
                <Box
                mb={1}
                >
                    <Typography
                    className={classes.typo}
                    variant="body1"
                    >
                        Bienvenido {user.username}
                    </Typography>
                </Box>

                <Box
                bgcolor="white"
                borderRadius={5}
                p={1}>
                    <Typography
                    variant="body2"
                    >
                        Tienes {suscripciones.length} suscripciones
                    </Typography>
                </Box>
            </Box>

            <Box
            bgcolor="primary.main"
            p={2}
            borderRadius={5}
            >
                <Box
                mb={1}
                >
                    <Typography
                    variant="h6"
                    className={classes.typoLight}
                    >
                        Información desde el Backend
                    </Typography>
                </Box>

                <Grid container>
                    <Grid item>
                        <Box
                        bgcolor="white"
                        borderRadius={5}
                        p={1}>
                            <Typography
                            variant="body2"
                            >
                                Tienes {suscripciones.length} suscripciones
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        </Box>
    )
}