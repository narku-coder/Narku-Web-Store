let express = require('express');
let app = express();
app.use(express.json());

let fs = require("fs");
let text = fs.readFileSync('randomItems.txt').toString('utf-8'); 
let items = text.substr(1, text.length);
items = items.replace(/\(/g, "");
items = items.replace(/\0/g, "");


let carts = [];
let users = [];
let store = [];

let i = 0;
let j = 0;
let k = 0;
let word;
let storeItem;
while (i < items.length)
{
    if(items.charAt(i) === ' ' || items.charAt(i) === '\n')
    { 
        word = items.substr((i-(j-1)), (j-1));
        storeItem = {
            "ID": k,
            "name": word
        };
        store.push(storeItem);
        j = 0;
        k++;
    }
    i++;
    j++;
}

let cartID = 1;
let userID = 1;
let cartItemID = 1;

let user1 = {
    "firstName":"SampleUser",
    "lastName": "random",
    "emailAddress": "sample@email.com",
    "ID" : 0
};

let cart1 = {
    "ID": 0,
    "user": user1,
    "items": []
};

let cartItem1 =
{
    "ID": 0,
    "name": "SampleCartItem",
    "quantity": 5
};


let num = 0;
carts.push(cart1);
users.push(user1);

app.listen(8080);

app.get('/user', (req, res) => {
    res.send(users);
});

app.get('/user/:userId', (req, res) => {
    console.log(req.params);
    const user = users.find(user => user['ID'] = parseInt(req.params.userId));
    res.send(user ? user : 404);  
});

app.post('/user', (req, res) => {
    let newUser = req.body;
    newUser.ID = userID;
    newUser.cart.ID = cartID;
    userID++;
    cartID++;

    users.push(newUser);
    res.send(newUser);

});

app.delete('/user/:userId', (req, res) => {
    let index = users.indexOf(req.params.userId);
    let user1 = users.splice(index,1);
    
    res.send(user1 ? user1 : 404);  
});

app.get('/user/:userId/cart', (req, res) => {
    const user = users.find(user => user['ID'] = parseInt(req.params.userId));
    const cart1 = user.cart;
    console.log("cart1 - " + cart1);
    res.send(cart1 ? cart1 : 404);
});


app.delete('/user/:userId/cart', (req, res) => {
    const carts1 = carts.filter((cart) => {
        return cart.user.userID === req.params.userId
    })
    
    let cartLen = carts1.length;
    let i;
    for (i = 0; i < cartLen; i++)
    {
        carts1[i].items.length = 0;
    }
    res.send(carts ? carts : 404)
});

app.post('/cart/:cartId/cartItem', (req, res) => {
    let item;
    item = store.find(storeItem => {
        return storeItem.name == req.params.cartItem;
    });

    if(item != undefined)
    {
        let cart;
        cart = carts.find((cart) => {
            return cart.cartID === req.params.cartId;
        })

        let item = req.body;
        item.ID = cartItemID++;

        cart.items.push(item);
        res.send(item); 
    }
});

app.delete('/cart/:cartId/cartItem/:cartItemId', (req, res) => {
    let cart1;
    cart1 = carts.find((cart) => {
        return cart.ID == req.params.cartId;
    })

    let index = cart1.items.indexOf(req.params.cartItemId);
    let item1 = cart1.items.splice(index,1);
    
    res.send(item1 ? item1 : 404);
});

app.get('/StoreItem/:storeItemId', (req, res) => {
    let item1;
    item1 = store.find((storeItem) => {
        return storeItem.ID == req.params.storeItemId;
    })

    res.send(item1 ? item1 : 404);
});

app.get('/StoreItem', (req, res) => {
    let item1 = [];
    let subject = req.query.name;
    let i = 0;
    while(i < store.length)
    {
        if(store[i].name.includes(subject))
        {
            item1.push(store[i]);
        }
        i++;
    }

    res.send(item1 ? item1 : 404);
});
