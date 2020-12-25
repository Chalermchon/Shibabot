const initialState = {
    loader: {
        loading: true,
        animate: false,
    },
    alert: {
        isDisplay: false,
        type: '',
        title: '',
        description: '',
        button: {
            display: false,
            onClick: null
        }
    },
    appBar: {
        title: '',
        cartIcon: false,
        sortIcon: false,
    }
}

const uiReducer = (state=initialState, { type, payload }) => {
    switch (type) {
        case 'SET_LOADER':
            return {
                ...state,
                loader: typeof payload === 'object'
                    ? {
                        loading: payload.loading,
                        animate: payload.animate
                      }                
                    : {
                        loading: payload,
                        animate: false
                      }
            }
        case 'SET_ERROR': {
            return {
                ...state,
                loader: {
                    loading: false,
                    animate: false
                },
                alert: typeof payload === 'object'
                    ? {
                        isDisplay: payload.isDisplay,
                        type: 'error',
                        title: payload.title,
                        description: payload.description,
                        button: {
                            display: false,
                            onClick: null
                        }
                      }
                    : {
                        isDisplay: payload,
                        type: 'error',
                        title: 'พบข้อผิดพลาดบางอย่าง',
                        description: 'กรุณาลองใหม่ในภายหลัง',
                        button: {
                            display: false,
                            onClick: null
                        }
                      }
            }
        }
        case 'SET_ALERT': {
            return {
                ...state,
                loader: {
                    loading: false,
                    animate: false
                },
                alert: {
                    isDisplay: payload.isDisplay,
                    type: payload.type,
                    title: payload.title,
                    description: payload.description,
                    button: {
                        display: payload.button ? payload.button.display : false,
                        onClick: payload.button ? payload.button.onClick : null
                    }
                }
            }
        }
        case 'SET_APPBAR': {
            return {
                ...state,
                appBar: {
                    title: payload.title,
                    cartIcon: payload.cartIcon,
                    sortIcon: payload.sortIcon,
                }
            }
        }
        default:
            return state
    }
}

export default uiReducer