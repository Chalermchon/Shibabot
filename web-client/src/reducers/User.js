const initialState = {
    isSignIn: false,
    notRegister: false,
    userId: '',
    groupId: '',
    name: '',
    image: '',
    localLocation: '',
}

const userReducer = (state=initialState, { type, payload }) => {
    switch (type) {
        case 'SET_USER':
            return {
                ...state,
                ...payload
            }
    
        default:
            return state
    }
}

export default userReducer