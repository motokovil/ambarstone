import React from 'react'

//Redux
// import {useSelector} from "react-redux"

//Router
import {Link} from "react-router-dom";

//MATERIAL UI NAVBAR
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import {makeStyles} from '@material-ui/core/styles';

//MATERIAL UI
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
    bgimagen: {
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgTjZ_YIT3Z_bjVZnbOx8DDYH1IcJU8srXjA&usqp=CAU")',
    }
}));

export default function Home(){

    //Hooks
    const classes = useStyles();

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
                <Link to="/Login" className={classes.Button}>
                <Button variant='outlined' color="primary" size='small'>Login</Button>
                </Link>

                <Link to="/SignUp" className={classes.Button}>
                <Button variant='outlined' color="primary" size='small'>Sign Up</Button>
                </Link>
            </Box>

            <Box 
            p={2}
            
            >

                <Box
                p={2}
                color='white'
                mb={1}
                height='40vh'
                bgcolor="primary.dark"
                borderRadius={5}
                >
                    <h1 className={classes.h}>Newsletter APP</h1>
                    <small>Designed for inspire</small>
                </Box>

                <Box
                p={2}
                bgcolor='white'
                borderRadius={5}
                color='text.secondary'
                mb={1}
                >
                    <h3 className={classes.h}>Suscribete</h3>
                    <small>Ahora tienes la opción de suscribirte a tus boletines favoritos.</small>
                </Box>

                <Box
                p={2}
                border={2}
                bgcolor="primary.dark"
                borderColor='white'
                borderRadius={5}
                color='white'
                mb={1}
                >
                    <h3 className={classes.h}>Boletines</h3>
                    <small>Mas de 80,000 historias para leer en la comodidad de tu dispositivo inteligente.</small>
                </Box>


            </Box>
        </Box>
    )
}