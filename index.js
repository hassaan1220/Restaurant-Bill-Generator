import bodyParser from 'body-parser';
import express from 'express';
const app = express();
const port = 3000;

// using let keyword for declaring the variables

let Bill_ID = 1;
let Customer_ID = 1;
let Customer = [];

// using middleware to add static files
app.use(express.static('assets'));

// using body parser middleware to parse the form data
app.use(bodyParser.urlencoded({ extended: true }));

// routes

// using a get request to render my "index.ejs" file which is basically the home page of my website
app.get('/', (req, res) => {
    res.render("index.ejs")
});

app.get('/orders', (req, res) => {
    res.render("orders.ejs", { data: Customer });
});

app.get('/bill', (req, res) => {
    res.render("recipt.ejs", {data: Customer});
});

// using a post req to pose my form data on the server and make it render dynamically on my website through.
app.post('/submit', (req, res) => {
    // using req parameter to parse my form data
    const table_no = req.body["table_no"];
    const date = req.body["date"];
    const time = req.body["time"];
    const product = req.body["product"];
    const price = req.body["price"];
    const quantity = req.body["quantity"];

    // Ensure arrays
    if (!Array.isArray(product)) product = [product];
    if (!Array.isArray(price)) price = [price];
    if (!Array.isArray(quantity)) quantity = [quantity];

    // Build product list and calculate total
    let items = [];
    let total = 0;
    for (let i = 0; i < product.length; i++) {
        const itemPrice = Number(price[i]);
        const itemQty = Number(quantity[i]);
        const amount = itemPrice * itemQty;
        items.push({
            PRODUCT: product[i],
            PRICE: itemPrice,
            QUANTITY: itemQty,
            AMOUNT: amount
        });
        total += amount;
    }

    const bill_details = {
        BillId: Bill_ID++,
        CustomerID: Customer_ID++,
        Table: table_no,
        Date: date,
        Time: time,
        Product: product,
        Quantity: quantity,
        Items: items,
        Total: total
    };

    // pushing an object in an array
    Customer.push(bill_details);
    res.render("orders.ejs", {data: Customer});
})

app.listen(port, (req, res) => {
    console.log(`server is running on port ${port}`);
})