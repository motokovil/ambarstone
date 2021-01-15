import {createMuiTheme} from '@material-ui/core/styles'
import lightblue from '@material-ui/core/colors/lightBlue'
const theme = createMuiTheme({

    palette:{
        primary: {
            main: lightblue[500],
            light: lightblue[300],
            ld: lightblue[750],
            dark: lightblue[800]
        }
    }

})

export default theme;