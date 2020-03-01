const express = require('express');
const stripe = require('stripe')('secret_key');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || 5000;

//HandleBars middleware

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

//Body Parser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set static folder

app.use(express.static(`${__dirname}/public`))

//Index Route 

app.get('/', (req,res) => {
    res.render('index');
})

//Charge Route

app.post('/charge',(req,res) => {
    const amount = 125;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source:req.body.stripeToken
    })
    .then( customer => stripe.charges.create({
        amount,
        description: 'Products for sale',
        currency: 'usd',
        customer: customer.id
    }))
    .then( charge => res.render('successs'));
})

app.listen(port, () => {
    console.log(`Server started on Port ${port}`);
});