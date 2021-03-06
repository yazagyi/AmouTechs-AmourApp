import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './Login';
import Customer from './Customer';
import Comm from './Comm';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'



React.Component.prototype.$url = 'https://localhost:3001';

ReactDOM.render(
  <React.StrictMode>

  <Router >
    <Route path="/admin" component={App}>
    </Route>
	
	<Route path="/index" component={Login}>
  
	</Route>
  <Route path="/Settings" component={App}>
    </Route>
    <Route path="/Clients" component={App}>
    </Route>
    <Route path="/Home" component={App}>
    </Route>
    <Route path="/Proposals" component={App}>
    </Route>

  <Route path="/viewproposal/:token" component={Customer}>
	</Route>
  </Router>
   
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
