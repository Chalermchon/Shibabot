import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { InitLiffAndSignIn, onSignIn } from './actions'
import { MyStore, QrCode, Register, SendProduct, Shopping } from './pages'

const App = () => {
    const dispatch = useDispatch()
    const { isSignIn } = useSelector(state => state.user)

    useEffect(() => {
        if (!isSignIn) {
            dispatch(InitLiffAndSignIn())
        } else {
            dispatch(onSignIn())
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignIn])

    return (
        <Switch>
            <Route path='/register' component={Register} />
            <Route path='/shopping' component={Shopping} />
            <Route path='/my-store' component={MyStore}  />
            <Route path='/send-product/:orderId' component={SendProduct} />
            <Route path='/qr-code/:orderId'      component={QrCode} />
        </Switch>
    )
}

export default App