import React from 'react';
import axios from 'axios';
import ScrollArea from 'react-scrollbar';
import './cart.css'

class Cart extends React.Component {

	constructor(props){
		super(props);
		console.log("this.props for cart - " + JSON.stringify(this.props));
		this.state = {
			cartItems: [],
			user: this.props.person,
			token: this.props.jwt,
			item: "",
			quantity: ""
		};
		this.deleteCart = this.deleteCart.bind(this);
		this.addItem = this.addItem.bind(this);
	}

	
	async componentDidMount() {
		console.log("It got to component did mount");
		await this.getCart();
	}

	async getCart() {
		console.log("It got to get cart");
		const headers  = {
			'Authorization': `Bearer ${this.state.token}`
		}
		const id = this.state.user._id;
		let cart = (await axios.get(`http://localhost:8080/user/${id}/cart`, {headers})).data;
		if(cart.items.length == 0)
		{
			let cartList = [];
			this.setState({cartItems: (<ul>{cartList}</ul>)})
		}
		else
		{
			let cartList = new Map();
			let i = 0;
			let objects = [];
			let nums = [];
			while(i < cart.items.length)
			{
				objects[i] = cart.items[i].storeItem;
				nums[i] = cart.items[i].quantity;
				i++;
			}
			const objectNames = objects.map(product => product.name);
			cartList = objectNames.map((product, index) => <li className="cartItemsLi" key={index}>{product + " - " + nums[index]}</li>);
			this.setState({cartItems: (<ul>{cartList}</ul>)})
		}
	}

	async addItem() {
		console.log("It got to add item");
		this.setState({item: this.props.product, quantity: this.props.number});
		const headers  = {
			'Authorization': `Bearer ${this.state.token}`
		}
		const id = this.state.user._id;
		let cart = (await axios.get(`http://localhost:8080/user/${id}/cart`, {headers})).data;
		const itemBody = {
			quantity: this.state.quantity,
			name: this.state.item.name
		}
		const cartId = cart._id;
		cart = (await axios.post(`http://localhost:8080/cart/${cartId}/cartItem`, itemBody, {headers},)).data;
		await this.getCart();
	}

	async deleteCart() {
		console.log("It got to delete cart");
		const headers  = {
			'Authorization': `Bearer ${this.state.token}`
		}
		const id = this.state.user._id;
		let cart = (await axios.delete(`http://localhost:8080/user/${id}/cart`, {headers})).data;
	}

	render() {
		console.log("It got to cart render");
		console.log("cartItems - " + JSON.stringify(this.state.cartItems)+ " user - " + JSON.stringify(this.state.user));
		if(this.props.product && this.props.number)
		{
			if(this.state.cartItems)
			{
				return(
					<ScrollArea
					speed={0.8}
					className="storeArea"
					contentClassName="storeItems"
					horizontal={false}
					>
					<div class="cart">
						<button className="deleteButton" onClick={this.deleteCart}>Delete Cart</button> 
						<button className="cartButton" onClick={this.addItem}>Add to Cart</button> 
						<h2 className="cartTitle">Cart</h2>                
						<ul className="cartItems">{this.state.cartItems}</ul>       
					</div>
				  </ScrollArea>);
			}
			else
			{
				return(
					<ScrollArea
					speed={0.8}
					className="storeArea"
					contentClassName="storeItems"
					horizontal={false}
					>
					<div class="cart">
						<button className="deleteButton" onClick={this.deleteCart}>Delete Cart</button>     
					</div>
				  </ScrollArea>);
			}
		}
		else if(this.state.cartItems)
		{
			return(
				<ScrollArea
				speed={0.8}
				className="storeArea"
				contentClassName="storeItems"
				horizontal={false}
				>
				<div className="cart">
					<button className="deleteButton" onClick={this.deleteCart}>Delete Cart</button> 
					<h2 className="cartTitle">Cart</h2>                
					<ul className="cartItems">{this.state.cartItems}</ul>       
				</div>
			  </ScrollArea>);
		}
		else
			{
				return(
					<ScrollArea
					speed={0.8}
					className="storeArea"
					contentClassName="storeItems"
					horizontal={false}
					>
					<div class="cart">
						<button className="deleteButton" onClick={this.deleteCart}>Delete Cart</button>     
					</div>
				  </ScrollArea>);
			}
	}
}

export default Cart;