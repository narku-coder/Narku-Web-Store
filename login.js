import React from 'react'
import axios from 'axios'

class Login extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			userName:'',
			password:'',
			jwt:''
		}
		this.LoginHandler = this.LoginHandler.bind(this);
		this.userNameHandler = this.userNameHandler(this);
		this.passwordHandler = this.passwordHandler(this);
	}

	async LoginHandler() {
		const loginBody = {
			userName: this.state.userName,
			password: this.state.password
		}
		const response = await axios.post('http://localhost:8080/user/login', loginBody);
		this.setState({jwt: response.data});
		console.log(response);
	}

	userNameHandler(event) {
		this.setState({userName: event.target.value})
	}

	passwordHandler(event) {
		this.setState({password: event.target.value})
	}

	render(){
		return (
		<div>
			<input placeholder={"Username"} onChange={this.userNameHandler}></input>
			<input onChange={this.passwordHandler} placeholder={"Password"} type="password"></input>
			<button onClick={this.LoginHandler}>Log in!</button>
		</div>
		);
	}
}

export default Login