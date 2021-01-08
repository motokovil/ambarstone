const isLogged = (state = null, action) => {
    switch (action.type) {
        case 'SIGN_IN':
            return true
        default:
            return null
    }
}

export default isLogged