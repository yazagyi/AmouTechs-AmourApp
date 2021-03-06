import './App.css';
import logo from './logo.svg';
import React from 'react'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import {ProSidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Home from './Home'
import Clients from './Clients'
import Proposals from './Proposals'
import Services from './Services'
import Library from './Library'
import Settings from './Settings'
import Customer from './Customer'
import Login from './Login'
import {Nav, Navbar, Form, FormControl, Dropdown} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import axios from 'axios';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orgname: ''
        };

        this.out = this.out.bind(this);

        this.login = this.login.bind(this);
    }

    componentDidMount() {
        this.getname()
        this.login()
    }


    out() {
        localStorage.setItem("user", "");
        this.props.history.push('/index');
    }

    login() {

        let intevalId = setInterval(() => {
            if (localStorage.getItem("user") == null || localStorage.getItem("user").trim() == ''){
                alert("You're not logged in")
                this.props.history.push('/index');
                clearInterval(intevalId)
                return
            }
            let user = JSON.parse(localStorage.getItem("user"))[0]
            if (!user.username || !user.password) {
                alert("You're not logged in")
                this.props.history.push('/index');
                clearInterval(intevalId)
                return;
            }

            var data = user

            axios.post(this.$url + '/users/loginHeart', data)
                .then(res => {

                    if (res.data != 0) {
                        // alert("Login successfully!")
                        //this.$login.login  = true;
                        // priKey = new NodeRSA(privateKey,'pkcs8-private');
                        // var decrypted = priKey.decrypt(buffer, 'utf8');
                        if ('Admin' in res.data[0]) {
                            localStorage.setItem("admin", 1)
                        } else {
                            localStorage.setItem("admin", 0)
                        }
                        localStorage.setItem("user", JSON.stringify(res.data))
                        // this.props.history.push('/admin');

                    } else {
                        alert("You're not logged in,Incorrect email or password!")
                        this.props.history.push('/index');
                        clearInterval(intevalId)
                        return
                    }
                })
                .catch(err => {
                    alert("Server Error!You're not logged in,Incorrect email or password!")
                    this.props.history.push('/index');
                    clearInterval(intevalId)
                    return
                })
        }, 1000)
        //TODO ????????????

    }

    getname() {
        if (localStorage.getItem("user") == null || localStorage.getItem("user").trim() == ''){
            alert("You're not logged in")
            this.props.history.push('/index');
            // clearInterval(intevalId)
            return
        }
        let orga = (JSON.parse(localStorage.getItem("user"))[0])

        let organ = orga.Organisation;

        axios.get(this.$url + '/users/OrgName?id=' + organ, null)
            .then(res => {
                console.log(res.data)
                this.setState({orgname: ((res.data)[0]).organisationName})
                console.log(this.state.orgname)
            })
    }

    render() {

        if (!localStorage.getItem("user")) {


            //  this.props.history.push('/index');
            return (<>Not logged in<Link to={'/index'}> click here to log in</Link></>);

        }

        console.log(localStorage.getItem("user"))
        let view = JSON.parse(localStorage.getItem("user"))[0]
        console.log(view)

        let admin = JSON.parse(localStorage.getItem("admin"))[0]
        let username = ''
        if (admin === 1) {
            username = view.Firstname + view.Lastname
        } else {
            username = view.FirstName + view.LastName
        }
        //console.log(view[2])
        return (
            <div className="App1">

                <Navbar expand="lg" variant='dark'>
                    <Navbar.Brand>{this.state.orgname}</Navbar.Brand>
                    <Form className="form-center">
                        <FormControl type="text" placeholder="Search" className=""/>
                    </Form>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">

                            {username}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="#/Settings">Settings</Dropdown.Item>
                            <Dropdown.Item onClick={() => this.out()} href="#/Logout">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* <Nav className="ml-auto">
          <Nav.Item>Username</Nav.Item>
        </Nav> */}
                    </Navbar.Collapse>
                </Navbar>


                <Router>
                    <aside>
                        <ProSidebar>
                            <Menu>
                                <MenuItem><img src={logo} className="App-logo" alt="logo"/></MenuItem>
                                <MenuItem><Link to={'/Home'}>Dashboard</Link></MenuItem>
                                <MenuItem><Link to={'/Clients'}>Clients</Link></MenuItem>
                                {/* <SubMenu title="Proposals">
                <MenuItem><Link to={'/Proposals'}>Create a new proposal</Link></MenuItem>
                <MenuItem>Export Proposals</MenuItem>
                <MenuItem>Import Proposals</MenuItem>
                <MenuItem>View Proposals</MenuItem>
              </SubMenu> */}
                                <MenuItem><Link to={'/Proposals'}>Proposals</Link></MenuItem>
                                <MenuItem><Link to={'/Settings'}>Settings</Link></MenuItem>
                                {/* <MenuItem><Link to={'/Customer'}>Customer</Link></MenuItem> */}
                            </Menu>
                        </ProSidebar>
                    </aside>

                    <main>

                        <Route path="/Home" component={Home}/>
                        <Route path="/Clients" component={Clients}/>
                        <Route path="/Proposals" component={Proposals}/>
                        <Route path="/Settings" component={Settings}/>
                        {/* <Route path="/Customer" component={Customer} /> */}
                    </main>
                </Router>
            </div>


        );
    }
}

export default App;
