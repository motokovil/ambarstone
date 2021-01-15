import React from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Home from './layout/home'
import Login from './layout/login'
import SignUp from './layout/signup'
import Admin from "./layout/admin"
import Dashboard from "./layout/dashboard"


//MUI
import {ThemeProvider} from '@material-ui/core/styles';
import theme from './themeConfig'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/Login" component={Login}/>
          <Route path="/SignUp" component={SignUp}/>
          <Route path="/Admin" component={Admin}/>
          <Route path="/Dashboard" component={Dashboard}/>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

export default App;
