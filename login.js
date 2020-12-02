import React from 'react';
import axios from 'axios';
import Store from './store';
import './login.css'

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			userName:'',
			password:'',
			jwt:'',
			loggedIn: false,
			user: ''
		};
		this.LoginHandler = this.LoginHandler.bind(this);
		this.userNameHandler = this.userNameHandler.bind(this);
		this.passwordHandler = this.passwordHandler.bind(this);
	}

	async LoginHandler() {
		const loginBody = {
			userName: this.state.userName,
			password: this.state.password
		}
		const response = await axios.post('http://localhost:8080/user/login', loginBody);
		if(response)
		{
			this.setState({jwt: response.data.accessToken, loggedIn: true, user: response.data.user});
		}
	}

	userNameHandler(event) {
		this.setState({userName: event.target.value})
	}

	passwordHandler(event) {
		this.setState({password: event.target.value})
	}

	render(){
		if(this.state.loggedIn)
		{
			return(
				<div className = "main">
					<header className="welcome" >
						<h1>Welcome to Bryan's Web Store {this.state.user.firstName} {this.state.user.lastName} </h1>
					</header>
					<Store person={this.state.user} token={this.state.jwt}/>
				</div>);
		}
		else{
			return(
			<div className = "main">
				<header className="welcome" >
					<h1>Welcome to Bryan's Web Store </h1>
				</header>
				<input className="user" placeholder={"Username"} onChange={this.userNameHandler}></input>
				<input className="password" onChange={this.passwordHandler} placeholder={"Password"} type="password"></input>
				<button className="submit" onClick={this.LoginHandler}>Log in!</button>
			</div>);
		}

	}
}

export default Login;