const mongoose = require('mongoose')
let url = 'mongodb+srv://dbAdminUser:owner127@cluster1.yf6y8.mongodb.net/storeDatabase?retryWrites=true&w=majority'
const User = require('./user');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const StoreItem = require('./storeItem');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

let database;
let app = express();
app.use(express.json());
const router = express.Router();

const initDataBase = async () => {
	database = await mongoose.connect(url);
	if(database) {
		app.use(session({
			secret: 'ASecretThatICantTell',
			store: new MongoStore({mongooseConnection: mongoose.connection})
		}));
		app.use(router);
		console.log("Successfully connected to database");
	}
	else{
		console.log("Error connecting to my DB");
	}
}

const init = async () => {
	await initDataBase();
}

app.listen(8080);

init();

router.get('/user', async (req, res) => {
	const users = await User.find({});
	res.send(users);
});

router.get('/user/:userId', async (req, res) => {
	const user = await User.findById(req.params.userId);
    res.send(user ? user : 404);  
});

router.post('/user', async (req, res) => {
	let newUser = req.body;

    const newUser2 = {
		firstName: newUser.firstName,
		lastName: newUser.lastName,
		emailAddress: newUser.emailAddress
	}

	const user = await User.create(newUser2);
	const newCart = {
		items: []
	}
	const cart = await Cart.create(newCart);

	user.cart = cart;
	await user.save()
    res.send(newUser);

});

router.delete('/user/:userId', async (req, res) => {
	const user = await User.findById(req.params.userId);

	if (user) {
		await user.remove();
	  }
    
    res.send(user ? user : 404);  
});

router.get('/user/:userId/cart', async (req, res) => {
	const user = await User.findById(req.params.userId);
	const cart1 = user.cart;
    res.send(cart1 ? cart1 : 404);
});


router.delete('/user/:userId/cart', async (req, res) => {
    const user = await User.findById(req.params.userId);
	const cart1 = user.cart;

	if (cart1) {
		await cart1.remove();
	  }
    res.send(cart1 ? cart1 : 404)
});

router.post('/cart/:cartId/cartItem', async (req, res) => {
    let item = await StoreItem.find({name: req.body.name});

    if(item)
    {
		let currCart = await Cart.findById(req.params.cartId);
	    let newItem = await CartItem.create(req.body);
		currCart.items.push(newItem);
		await currCart.save();
		await newItem.save();

		res.send(newItem);
    }
});

router.delete('/cart/:cartId/cartItem/:cartItemId', async (req, res) => {
	let currCart = await Cart.findById(req.params.cartId);
	let currItem;
	if (currCart) {
		currItem = await CartItem.findById(req.params.cartItemId)
		if(currItem)
		{
			await currItem.remove()
		}
	  }
	await currCart.save();
	await currItem.save();

	res.send(currItem);
});

let numItems;
let viewItems = [];
router.get('/StoreItem/:storeItemId', async (req, res) => {
    let currItem = await StoreItem.findById(req.params.storeItemId);
	req.session.numCalls++;
	req.session.items = [];
	viewItems.push(currItem);
	req.session.items = viewItems;
    res.send(currItem ? currItem : 404);
});


router.get('/StoreItem', async (req, res) => {
	const items = await StoreItem.find({});
	
    res.send(items ? items : 404);
});

router.get('/StoreItem/Recent', async (req, res) => {
	let numOfCalls = req.session.numCalls;
	//let num = req.query.num;
	console.log("num - " + num /*+ " and numOfCalls - " + numOfCalls*/);
	res.send("num - " + num /*+ " and numOfCalls - " + numOfCalls*/);
	/*
	if (num > numOfCalls)
	{
		res.send(404 + "Too many items");
	}
	else
	{
		let i = 0;
		items = [];
		while(i < num)
		{
			console.log("req.session.items[i] - " + req.session.items[i]);
			//items.push(req.session.items[i]);
			i++;
		}
		res.send(items);
	}*/
});
