const initialState = null

const ordersReducer = (state=initialState, { type, payload }) => {
    switch (type) {
        case 'SET_ORDERS':
            return {
                ...state,
                ...payload
            }
    
        default:
            return state
    }
}

export default ordersReducer