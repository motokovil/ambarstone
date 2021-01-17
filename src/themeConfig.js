import {createMuiTheme} from '@material-ui/core/styles'
import teal from '@material-ui/core/colors/teal'

const theme = createMuiTheme({

    palette:{
        primary: {
            main: teal[500],
            light: teal[300],
            ld: teal[750],
            dark: teal[800]
        }
    }

})

export default theme;