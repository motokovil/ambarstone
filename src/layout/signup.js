import React, {useState} from 'react'
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    Button:{
        textDecoration: 'none',
        marginRight: '5px'
    },
    title: {
        flexGrow: 1
    },
    h:{
        margin:0,
    },
    link:{
        textDecoration: 'none',
        color: 'inherit'
    },
    bgimagen: {
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgTjZ_YIT3Z_bjVZnbOx8DDYH1IcJU8srXjA&usqp=CAU")',
    }
}));

export default function Login(){
    
    //Hooks
    const [loginForm, setLoginForm] = useState({});

    //Material UI
    const classes = useStyles()

    //Funciones
    const onChangeInput = (event) => {
        setLoginForm({...loginForm, [event.target.name] : event.target.value });
    }

    const signUp = (event) => {
        event.preventDefault()
        fetch("http://localhost:8000/users/", {
            method: "POST",
            body: JSON.stringify(loginForm),
            headers: { 
                "Content-type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.username === loginForm.username){
                fetch("http://localhost:8000/users/"+data.id+"/encrypt")
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <Box
        bgcolor='primary.main'
        height='100vh'
        >
            <Box 
            p={2} 
            display='flex'
            justifyContent='flex-end'
            bgcolor='primary.dark'
            >
                <Button 
                variant='outlined' 
                size='small'
                className={classes.Button}
                color='primary'
                >
                    <Link className={classes.link} to="/">Home</Link>
                </Button>
            </Box>

            <Box 
            bgcolor='primary.main'
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='80vh'
            >
                <form onInput={onChangeInput} onSubmit={signUp}>
                    <Box 
                        bgcolor='white'
                        display= 'flex'
                        flexDirection= 'column'
                        padding= '20px'
                        color= 'primary.dark'
                        borderRadius= '5px'
                    >
                        <Box
                        height='80px'
                        >
                            <h2 className={classes.h}>Registrate</h2>
                            <small>¡Que lo disfrutes!</small>
                        </Box>

                        <TextField
                            label="Name"
                            id="username"
                            name="username"
                            variant="outlined"
                            size="small"
                            margin="normal"
                            required
                        />

                        <TextField
                            label="Email"
                            id="email"
                            name="email"
                            variant="outlined"
                            size="small"
                            margin="normal"
                            type= "email"
                            required
                        />

                        <TextField
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            size='small'
                            margin="normal"
                            required
                        />

                        <Button variant="contained" color="primary" type="submit">
                            Iniciar Sesión
                        </Button>
                        
                    </Box>
                </form>
            </Box>
        </Box>
    )
}