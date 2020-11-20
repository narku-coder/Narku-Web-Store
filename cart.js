import React from 'react';
import axios from 'axios';
import ScrollArea from 'react-scrollbar';
import './cart.css'

class Cart extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			cartItems: [],
			user: "",
			token:''
		};
	}

	
	async componentDidMount() {
		this.setState({user: this.props.person, token: this.props.token});
		console.log("user - " + JSON.stringify(this.state.user) + " token - " + JSON.stringify(this.state.token)+ "In cart mount");
		await this.addItem();
	}
	 
	
	async addItem() {
		const id = this.state.user._id;
		console.log("id - " + id);
		const headers  = {
			'Authorization': `Bearer ${this.state.token}`
		}
		const cart = (await axios.get(`http://localhost:8080/user/${id}/cart`, {headers})).data;
		console.log("cart - " + JSON.stringify(cart));
		/*
		cart.push(this.props.item);
		const cartList = cart.map((product, index) => <li key={index}>{product.name}</li>);
		this.setState({cartItems: (<ol>{productsList}</ol>)});*/
	}

	render() {
		return(
			<ScrollArea
            speed={0.8}
            className="storeArea"
            contentClassName="storeItems"
            horizontal={false}
            >
            <div class="cart">                
				<ul>{this.state.cartItems}</ul>           
			</div>
          </ScrollArea>);
	}
}

export default Cart;