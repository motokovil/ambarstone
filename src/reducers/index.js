import counter from "./auth"
import isLogged from "./isLogged"

import { combineReducers } from "redux";

const allReducers = combineReducers({
    counter,
    isLogged
})

export default allReducers