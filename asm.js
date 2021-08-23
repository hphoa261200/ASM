const express = require('express');
const app = express();
const session = require('express-session')
const url = "mongodb+srv://hoanghoa:hoanghoa2612@cluster1.2mgjt.mongodb.net/test";

const {MongoClient} = require("mongodb");

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'secret',
    cookie:{maxAge: 60000}
}));

app.get('/login', (req,res)=>{
    res.render('login')
})

app.post('/doLogin',(req,res)=>{
    const name = req.body.txtName;
    const pass = req.body.txtPassword;
    // valid user: tom; 123
    if((name == "hoa") && (pass == "123")){
        req.session["User"] ={
            name: "hoa",
            role: "admin"
        } 
    }
    res.redirect('/');
})

app.get('/', async (req,res)=>{
    if(req.session["User"]== null){
        res.redirect('/login')
    }
    const client = await MongoClient.connect(url);
    const dbo = client.db("GCH0805");
    const allMorto = await dbo.collection("morto").find({}).toArray();
    res.render("index", {data: allMorto});
})

app.post('/insert', async (req,res)=>{
    const productInput = req.body.txtProduct;
    const priceInput = req.body.txtPrice;
    const imageInput = req.body.txtImage;
    const allToys = {product: productInput, price: priceInput, image: imageInput};

    const client = await MongoClient.connect(url);
    const dbo = client.db("GCH0805");
    const allMorto = await dbo.collection("morto").insertOne(allToys);
    res.redirect("/");
})

app.post('/search', async(req,res)=>{
    const searchProduct = req.body.txtSearch;

    const client = await MongoClient.connect(url);
    const dbo = client.db("GCH0805");
    const result = await dbo.collection("morto").find({product:searchProduct}).toArray();

    res.render('index',{data:result})
}) 

const PORT = process.env.PORT || 5001;
app.listen(PORT);
console.log("app is running: " , PORT);
