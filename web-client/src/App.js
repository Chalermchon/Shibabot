import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import NotificationsSystem, { wyboTheme, useNotifications } from 'reapop'
import { fetchLineLiff } from './actions'
import { RegisterPage } from './pages'

const App = () => {
    const dispatch = useDispatch()
    const {notifications, dismissNotification} = useNotifications()

    useEffect(() => {
        dispatch(fetchLineLiff())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <NotificationsSystem
                notifications={notifications}
                dismissNotification={(id) => dismissNotification(id)}
                theme={wyboTheme}
            />
            <Switch>
                <Route path='/register/:groupId' component={RegisterPage} />
            </Switch>
        </>
    )
}

export default App