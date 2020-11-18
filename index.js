const mongoose = require('mongoose')
let url = 'mongodb+srv://dbAdminUser:owner127@cluster1.yf6y8.mongodb.net/storeDatabase?retryWrites=true&w=majority'
const User = require('./user');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const StoreItem = require('./storeItem');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const jwt = require('jsonwebtoken');

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
const accessTokenSecret = 'ASecretThatNoOneKnows';
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("authHeader - " + authHeader);
    if (authHeader) {
		console.log("It got to the authHeader if.");
        const token = authHeader.split(' ')[1];
		console.log("token - " + token);
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
        });
    } else {
        res.sendStatus(401);
	}
	//next();
};

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
	  "Access-Control-Allow-Headers",
	  "Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
  });

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
		emailAddress: newUser.emailAddress,
		userName: newUser.userName,
		password: newUser.password

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

router.post('/user/login',  authenticateJWT, async (req, res) => {
	const {userName, password} = req.body;
	const user = await User.findOne({userName, password});;
	if (user) {
        // Generate an access token
        const accessToken = jwt.sign({user}, accessTokenSecret);

        res.send({accessToken});
    } else {
        res.send('Username or password incorrect');
    }

})

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
	if(req.params.storeItemId == 'Recent')
	{
		numItems = req.query.num;
		let lastIndex = req.session.numCalls;
		if(numItems > req.session.lastItemViewed.length)
		{
			res.send(404 + "You did not view that many items.");
		}
		else
		{
			let num = 0;
			while(num < numItems)
			{
				viewItems.push(req.session.lastItemViewed[(lastIndex - 1)]);
				lastIndex--;
				num++;
			}

			res.send(viewItems);
		}
	}
	else
	{
		let currItem = await StoreItem.findById(req.params.storeItemId);
		if(!req.session.lastItemViewed)
		{
			req.session.lastItemViewed = [currItem];
			req.session.numCalls = 1;
		}
		else
		{
			req.session.lastItemViewed.push(currItem);
			req.session.numCalls++;
		}
		console.log("req.session.lastItemViewed - " + req.session.lastItemViewed);
		/*
		req.session.items = [];
		viewItems.push(currItem);
		req.session.items = viewItems;*/
		//res.json(req.session.lastItemViewed);
		res.send(currItem ? currItem : 404);
	}
});


router.get('/StoreItem', async (req, res) => {
	const items = await StoreItem.find({});
	
    res.send(items ? items : 404);
});

router.get('/Session', async (req, res) => {
	req.session.lastItemViewed = [{}];
	req.session.numCalls = 0;
	req.session.items = [{}];
	
    res.send("Session has been reset.");
});

