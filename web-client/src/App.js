import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { fetchLineInfo, onSignIn } from './actions'
import { MyStore, Register } from './pages'

const App = () => {
    const dispatch = useDispatch()
    const { isSignIn } = useSelector(state => state.user)

    useEffect(() => {
        if (!isSignIn) {
            dispatch(fetchLineInfo())
        } else {
            dispatch(onSignIn())
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignIn])

    return (
        <Switch>
            <Route path='/register' component={Register} />
            <Route path='/my-store' component={MyStore} />
        </Switch>
    )
}

export default App