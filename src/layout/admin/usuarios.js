import React, { useState, useEffect, useCallback } from "react"
import { useCookies } from "react-cookie";

//MATERIAL UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid } from "@material-ui/core";

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
});

export default function Usuarios() {

    const classes = useStyles();

    //Hooks
    const [, setIsSuper] = useState({ superuser: null })
    const [cookies] = useCookies(['token']);
    const [, setUser] = useState({})
    const [users, setusers] = useState([])

    const auth = (token) => {
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
        }
    }
    const getUsers = useCallback(
        () => {
            fetch("http://localhost:8000/users/", {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + cookies.token,
                    }
                })
                .then(res => res.json())
                .then(res => setusers(res.results))
                .catch(error => console.log(error))
        }, [cookies.token],
    )

    useEffect(() => {
        auth(cookies.token)
        getUsers()
    }, [cookies.token, getUsers])

    return ( 
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
                        <Typography variant="body2" component="p">
                        Details
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>
                </Grid>
            ))
        } 
        </Grid>
    )
}