import React from 'react';
import axios from 'axios';
import ScrollArea from 'react-scrollbar';
import Cart from './cart';
import './store.css'

class Store extends React.Component 
{
	constructor(props){
		super(props);
		this.state = {
			items: [],
			id: "",
			product:"",
			user:"",
			token: "",
			list: [],
			quantity: "",
			term: "",
			list2: [],
			displayCart: false
		};
		this.handleItemNum = this.handleItemNum.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleQuantity = this.handleQuantity.bind(this);
		this.searchAction = this.searchAction.bind(this);
		this.setItem = this.setItem.bind(this);
	}

	async componentDidMount() {
		await this.getItems();
		this.setState({user: this.props.person, token: this.props.token});
	}
	async getItems() {
		const products = (await axios.get('http://localhost:8080/StoreItem')).data;
		const productsList = products.map((product, index) => <li key={index}>{product.name}</li>);
		this.setState({items: (<ol>{productsList}</ol>), list: products});
	}

	handleItemNum(event) {
		this.setState({id: event.target.value})
	}

	handleQuantity(event) {
		this.setState({quantity: event.target.value})
	}

	handleSearch(event) {
		this.setState({term: event.target.value})
	}

	setItem() {
		const num = this.state.id;
		const item = this.state.list[(num-1)];
		this.setState({product: item, displayCart: true});
	}

	async searchAction() {
		const query = this.state.term;
		const products2 = (await axios.get(`http://localhost:8080/StoreItem?term=${query}`)).data;
		const productsList2 = products2.map((product, index) => <li key={index}>{product.name}</li>);
		this.setState({list2: (<ol>{productsList2}</ol>)});
	}

	render() 
	{
		console.log("this.state for store - " + JSON.stringify(this.state));

		if(this.state.user)
		{
			if(this.state.id && this.state.quantity)
			{
				return(
					<ScrollArea
					speed={0.8}
					className="storeArea"
					contentClassName="storeItems"
					horizontal={false}
					>
						<div className="column search"> 
							<h2>Inventory</h2>                
							<ol type="1">{this.state.items}</ol>          
						</div>
						<div className="column addItems"> 
							<input id="searchIn" type="text" onChange={this.handleSearch} />
							<button className="searchButton" onClick={this.searchAction}>Search</button>   
							<label htmlFor="itemNum" className="itemLabel">Item Number: </label>               
							<input id="itemNum" type="text" onChange={this.handleItemNum} />
							<label htmlFor="quantity" className="quantityLabel">Quantity: </label>
							<input id="quantity" type="text" onChange={this.handleQuantity} />
							<button className="showButton" onClick={this.setItem}>Set Item</button>          
						</div>
						<div className="column cart">
							<Cart person={this.state.user} jwt={this.state.token} product={this.state.product} number={this.state.quantity}/>
						</div>
			 	 </ScrollArea>);
				}
			else if(this.state.term)
			{
				return(
					<ScrollArea
					speed={0.8}
					className="storeArea"
					contentClassName="storeItems"
					horizontal={false}
					>
						<div className="column search"> 
							<h2>Inventory</h2>               
							<ol type="1">{this.state.list2}</ol>            
						</div>
						<div className="column addItems"> 
							<input id="searchIn" type="text" onChange={this.handleSearch} />
							<button className="searchButton" onClick={this.searchAction}>Search</button>
							<label htmlFor="itemNum" className="itemLabel">Item Number: </label>               
							<input id="itemNum" type="text" onChange={this.handleItemNum} />
							<label htmlFor="quantity" className="quantityLabel">Quantity: </label>
							<input id="quantity" type="text" onChange={this.handleQuantity} />         
						</div>
						<div className="column cart">
							<Cart person={this.state.user} jwt={this.state.token} product={this.state.product} number={this.state.quantity}/>
						</div>
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
						<div class="column search">
							<h2>Inventory</h2>                 
							<ol type="1">{this.state.items}</ol>
						</div>
						<div className="column addItems"> 
							<input id="searchIn" type="text" onChange={this.handleSearch} />
							<button className="searchButton" onClick={this.searchAction}>Search</button>
							<label htmlFor="itemNum" className="itemLabel">Item Number: </label>               
							<input id="itemNum" type="text" onChange={this.handleItemNum} />
							<label htmlFor="quantity" className="quantityLabel">Quantity: </label>
							<input id="quantity" type="text" onChange={this.handleQuantity} /> 
							<button className="showButton" onClick={this.setItem}>Set Item</button>       
						</div>
						<div className="column cart">
							<Cart person={this.state.user} jwt={this.state.token}/>
						</div>
			 	 </ScrollArea>);
				}
			}
			else
			{
				if(this.state.term)
				{
					return(
						<ScrollArea
							speed={0.8}
							className="storeArea"
							contentClassName="storeItems"
							horizontal={false}
						>
						<div className="column search"> 
							<h2>Inventory</h2>               
							<ol type="1">{this.state.list2}</ol>            
						</div>
						<div className="column addItems"> 
							<input id="searchIn" type="text" onChange={this.handleSearch} />
							<button className="searchButton" onClick={this.searchAction}>Search</button>
							<label htmlFor="itemNum" className="itemLabel">Item Number: </label>               
							<input id="itemNum" type="text" onChange={this.handleItemNum} />
							<label htmlFor="quantity" className="quantityLabel">Quantity: </label>
							<input id="quantity" type="text" onChange={this.handleQuantity} />         
						</div>
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
							<div class="column search">
								<h2>Inventory</h2>                 
								<ol type="1">{this.state.items}</ol>
							</div>
							<div className="column addItems"> 
								<input id="searchIn" type="text" onChange={this.handleSearch} />
								<button className="searchButton" onClick={this.searchAction}>Search</button>
								<label htmlFor="itemNum" className="itemLabel">Item Number: </label>               
								<input id="itemNum" type="text" onChange={this.handleItemNum} />
								<label htmlFor="quantity" className="quantityLabel">Quantity: </label>
								<input id="quantity" type="text" onChange={this.handleQuantity} /> 
								<button className="showButton" onClick={this.setItem}>Set Item</button>       
							</div>
					
			  			</ScrollArea>);
					}
				}
			}	
		}

export default Store;