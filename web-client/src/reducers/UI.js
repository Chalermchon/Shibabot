const initialState = {
    loader: {
        loading: false,
        animate: false
    },
    error: {
        isError: false,
        title: '',
        description: ''
    }
}

const uiReducer = (state=initialState, { type, payload }) => {
    switch (type) {
        case 'SET_LOADER':
            return {
                ...state,
                loader: {
                    loading: payload.loading,
                    animate: payload.animate
                }                
            }
        case 'SET_ERROR': {
            return {
                ...state,
                loader: {
                    loading: false,
                    animate: false
                },
                error: {
                    isError: payload.isError,
                    title: payload.title,
                    description: payload.description
                }
            }
        }
        default:
            return state
    }
}

export default uiReducer