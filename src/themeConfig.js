import {createMuiTheme} from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
const theme = createMuiTheme({

    palette:{
        primary: {
            main: red[500],
            light: red[300],
            ld: red[750],
            dark: red[800]
        }
    }

})

export default theme;