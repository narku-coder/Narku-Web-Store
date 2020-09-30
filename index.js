const express = require('express');
const app = express();

let fs = require("fs");
let text = fs.readFileSync("./randomItems.txt").toString('utf-8');
let items = text.split("\n");

let carts = [];
let users = [];
let store = [];

let i = 0;
while (i < 50)
{
    let storeItem = {
        ID: (i + 1),
        name: items[i]
    }

    store.push(storeItem);
    i++;
}
let cartID = 0;
let userID = 0;
let cartItemID = 0;

let user1 = {
    ID: userID++,
    firstName:"SampleUser",
    lastName: "random",
    emailAddress: "sample@email.com"
};

let cart1 = {
    ID: cartID++,
    user: user1,
    items: []
};

let cartItem1 =
{
    ID: cartItemID++,
    name: "SampleCartItem",
    quantity: 5
};

carts.push(cart1);
cart1.items.push(cartItem1);

let num = 0;

app.get('/user', (req, res) => {
    res.send(users);
});

app.get('/user/:userId', (req, res) => {
    let user1;
    user1 = users.find((user) => {
        return user.ID == req.params.userId;
    })

    res.send(user1 ? user1 : 404);  
});

app.post('/user', (req, res) => {
    let user = req.body;
    user.ID = num;
    num++;

    users.push(user);
    res.send(user);
});

app.delete('/user/:userId', (req, res) => {
    let index = users.indexOf(req.params.userId);
    let user1 = users.splice(index,1);
    
    res.send(user1 ? user1 : 404);  
});

app.get('/user/:userId/cart', (req, res) => {
    const carts = carts.filter((cart) => {
        return carts.user.userID === req.params.userId
    })
    res.send(carts ? carts : 404)
});

app.delete('/user/:userId/cart', (req, res) => {
    const carts1 = carts.filter((cart) => {
        return cart.user.userID === req.params.userId
    })
    
    let cartLen = carts.length;
    let i;
    for (i = 0; i < cartLen; i++)
    {
        carts[i].items.length = 0;
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

app.listen(8080);