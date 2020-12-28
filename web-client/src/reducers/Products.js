const initialState = null 

const productsReducer = (state=initialState, { type, payload }) => {
    switch (type) {
        case 'SET_PRODUCTS':
            return {
                ...state,
                ...payload
            }
    
        default:
            return state
    }
}

export default productsReducer