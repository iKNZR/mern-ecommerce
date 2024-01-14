import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import Product from './models/Products.js';
import Users from './models/Users.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


//TODO ATOMIZE CODE

//IMAGE STORAGE
const storage = multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({ storage: storage });

//IMAGE UPLOAD ENDPOINT
app.use('/images', express.static('uploads/images'));
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${PORT}/images/${req.file.filename}`
    })
})

//ADMIN ROUTES
//TODO - ADD TRYCATCHS STATEMENTS TO ALL ROUTES
// ROUTES
app.get("/", (req, res) => {
    res.send("Welcome to the server")
})
app.post("/addproduct", async (req, res) => {
    try {
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        } else {
            id = 1;
        }
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });
        console.log(product);

        await product.save();
        console.log("Product saved to database");
        res.json({
            success: true,
            name: req.body.name,
        });

    } catch (error) {
        res.send(error.message);
    }
})

//DELETE PRODUCTS
app.post("/removeproduct", async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        res.json({
            success: true,
            id: req.body.id,
        });
    } catch (error) {
        res.send(error.message);
    }
})

//GET PRODUCTS
app.get("/allproducts", async (req, res) => {
    let products = await Product.find({});
    res.send(products)
})

//USERS ROUTES 

//REGISTER USER
app.post("/signup", async (req, res) => {

    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Email is already registered" })
    }
    let cart = {}
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });
    //TODO - HASH PASSWORD
    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token })

})

//LOGIN USER
//TODO - ADD MIDDLEWARE
app.post("/login", async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, "secret_ecom");
            res.json({ success: true, token })
        } else {
            res.status(400).json({ success: false, errors: "Wrong password" })
        }
    }
    else {
        res.json({ success: false, errors: "User not found or wrong email" })
    }
})

//NEW COLLECTION DATA
app.get("/newcollection", async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New collection fetched");
    res.send(newcollection);
})

//POPULAR IN WOMAN
app.get("/popularinwoman", async (req, res) => {
    let products = await Product.find({});
    let popularinwomen = [];
    for (let product of products) {
        if (product.category === "women") {
            popularinwomen.push(product);
        }
    }
    res.send(popularinwomen)
})

//MIDDLEWARE TO FETCH USER
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    } else {
        try {
            const data = jwt.verify(token, "secret_ecom");
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ error: "Please authenticate using a valid token" });
        }
    }
}

//CART DATA ENDPOINT

//ADD TO CART
app.post("/addtocart", fetchUser, async (req, res) => {
    console.log("added", req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added to cart");
});

//REMOVE FROM CART
app.post("/removefromcart", fetchUser, async(req, res)=>{
    console.log("removed", req.body.itemId)
    let userData = await Users.findOne({ _id: req.user.id });
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed from cart");
});

//GET CART DATA
app.post("/getcart", fetchUser, async (req, res)=>{
    console.log("getcart");
    let userData = await Users.findOne({_id: req.user.id});
    res.json(userData.cartData);
})


// DATABASE CONNECTION
const PORT = process.env.PORT;
const URL = process.env.MONGO_URL;

mongoose.connect(URL).then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
}).catch((error) => console.log(error.message));    
