const initialState = null

const neighborsReducer = (state=initialState, { type, payload }) => {
    switch (type) {
        case 'SET_NEIGHBORS':
            return {
                ...state,
                ...payload
            }
    
        default:
            return state
    }
}

export default neighborsReducer