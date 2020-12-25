import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'
import { BrowserRouter } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider as ReduxProvider } from 'react-redux'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import App from './App'
import theme from './theme'
import rootReducer from './reducers'
import reportWebVitals from './reportWebVitals'
import { Alert, Loader } from './components'

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
            <GlobalStyled />
            <Loader />
            <Alert />
            <App />
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
