import React from 'react';
import axios from 'axios';
import ScrollArea from 'react-scrollbar';
import Cart from './cart';
import './store.css'

class Store extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			items: [],
			items2: [],
			product:"",
			user:"",
			token: ""
		};
		this.addItemtoCart = this.addItemtoCart.bind(this);
	}

	async componentDidMount() {
		await this.getItems();
		this.setState({user: this.props.person, token: this.props.token});
	}
	async getItems() {
		const products = (await axios.get('http://localhost:8080/StoreItem')).data;
		const productsList = products.map((product, index) => <li key={index}>{product.name}<button
		type="button"
		onClick={this.addItemtoCart(index)}>Add</button></li>);
		this.setState({items: (<ol>{productsList}</ol>), items2:{products}});
	}

	addItemtoCart = i => {
		this.setState({product:this.state.items2[i], clicked:true});
	  };

	render() {
		console.log("user - " + JSON.stringify(this.state.user) + " token - " + JSON.stringify(this.state.token)+ "In store render");
		if(this.state.user)
		{
			return(
			<ScrollArea
            speed={0.8}
            className="storeArea"
            contentClassName="storeItems"
            horizontal={false}
            >
            	<div class="itemsList">                
					<ol type="1">{this.state.items}</ol>            
				</div>
				<Cart item={this.state.product} person={this.state.user} token={this.state.token}/>
		  </ScrollArea>);
		}
		else{
			return(
				<ScrollArea
				speed={0.8}
				className="storeArea"
				contentClassName="storeItems"
				horizontal={false}
				>
					<div class="itemsList">                
						<ol type="1">{this.state.items}</ol>            
					</div>
			  </ScrollArea>);
		}
	}
}

export default Store;