import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider as ReduxProvider } from 'react-redux';
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { NotificationsProvider } from 'reapop'
import App from './App'
import reportWebVitals from './reportWebVitals'
import theme from './theme'
import rootReducer from './reducers'

const GlobalStyled = createGlobalStyle`
  * {
    font-family: 'Kanit';
  }
`

const store = createStore(rootReducer, applyMiddleware(thunk))

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store} >
      <BrowserRouter>
        <ThemeProvider theme={theme} >
          <NotificationsProvider >
            <GlobalStyled />
            <App />
          </NotificationsProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
