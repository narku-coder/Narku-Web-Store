import React from 'react'
import axios from 'axios'
const ScrollArea = require('react-scrollbar');

class Store extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			items:''
		}
		this.getItems = this.getItems.bind(this);
	}

	async getItems() {
		const products = await axios.get('/StoreItem');
		this.setState({items: products});
	}

	render() {
		this.getItems();
		return (
			<ScrollArea
            speed={0.8}
            className="storeArea"
            contentClassName="storeItems"
            horizontal={false}
            >
            	<div className="AuthorsList">                
					<ul>                    
					<li>{this.state.items}</li>                                   
					</ul>            
				</div>
          </ScrollArea>
		);
	}
}

export default Store