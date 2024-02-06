//  Constant Variables
const express = require('express')
const path = require('path')
const mysql = require('./data')
const basicAuth = require('express-basic-auth')
const app = express()
const port = 4131
const main = ['/', '/main','/mainpage']
const validKeys = ['name_field', 'email_field', 'date_field', 'reason', 'check_field', 'submit_button']
const requiredKeys = ['name_field', 'email_field', 'date_field']

//  Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("./resources"));
app.set("views", "./resources/templates");
app.set("view engine", "pug")

app.get(main, (req, res) => {
    res.set('Content-Type: text/html; charset=utf-8')
    res.status(200).render("mainpage.pug")
})

app.get('/contact', (req, res) => {
    res.set('Content-Type: text/html; charset=utf-8')
    res.status(200).render("contactform.pug");
})

app.get('/testimonies', (req, res) => {
    res.set('Content-Type: text/html; charset=utf-8')
    res.status(200).render("testimonies.pug");
})

app.get('/api/sale', async (req,res) => {
    res.set('Content-Type: application/json')
    let salePacket = await mysql.getRecentSales();
    let sales;
    if (salePacket.length != 0){
        if( salePacket[0].timeEnded === null) {
            sales = {'active': true, 'message': salePacket[0].saleText}
            res.status(200).send(sales);
        }
        else {
            sales = {'active': false, 'message': ''}
            res.status(200).send(sales);
        }
    }
    else {
        res.status(200).send();
    }  
})

app.get('/admin/salelog', async (req, res) => {
    res.set('Content-Type: application/json')
    let recentSales = await mysql.getRecentSales();
    res.status(200).send(recentSales);
})

app.get('/admin/contactlog', basicAuth({users: {'admin': 'password'}, challenge: true, unauthorizedResponse: 'Forbidden'}) , async (req, res) => {
    res.set('Content-Type: text/html; charset=utf-8')
    let data = await mysql.getContacts();
    res.render("contactlog.pug", {data:data})
})

app.post('/contact', (req, res) =>  {
    let invalid = false;
    let requiredCount = 0;
    res.set('Content-Type: text/html; charset=utf-8')

    //  checks if user sent data through url instead of body
    if ((req.body.constructor === Object && Object.keys(req.body).length == 0) 
        || req.query.constructor === Object && Object.keys(req.query).length > 0) {
        res.status(400).render("denied.pug")
    }
    else {
        for( key in req.body) {  //  Check to see if user includes only valid keys
            if (! validKeys.includes(key)) {
                invalid = true
            }
            if (requiredKeys.includes(key)) {  //  Check to see if user includes all required keys
                requiredCount += 1;
            }
        }
        if(invalid){
            res.status(400).render("denied.pug")
        }
        else if (requiredCount != requiredKeys.length) {
            res.status(400).render("denied.pug")
        }
        else{
            if (req.body.check_field === undefined) {  // Check if the user submitted without cash option
                req.body.check_field = 'no';
            }
            if (req.body.reason === undefined) {  // Check if user submitted without a reason. Ensures proper sql query
                req.body.reason = '';
            }
            mysql.addContact(req.body)
            res.status(201).render("confirmation.pug")
        }
    }
})

app.post('/api/sale', basicAuth({users: {'admin': 'password'}, challenge: true, unauthorizedResponse: 'Forbidden'}), async (req, res) => {
    let json = req.body;
    await mysql.addSale(json.message);
    res.set('Content-Type: application/json')
    res.status(200).send(JSON.stringify(json.message));

})

app.delete('/api/sale', basicAuth({users: {'admin': 'password'}, challenge: true, unauthorizedResponse: 'Forbidden'}), async (req, res) => {
    res.set('Content-Type: text/plain')
    await mysql.endSale()
    res.status(200).send('Sale has ended.');

})

app.delete('/api/contact', basicAuth({users: {'admin': 'password'}, challenge: true, unauthorizedResponse: 'Forbidden'}), async (req, res) => {
    res.set('Content-Type: text/html; charset=utf-8');
    let data = await mysql.getContacts();
    let idx = parseInt(req.body.id);
    if (isNaN(idx)) {
        res.status(400).render("contactlog.pug",{data:data});
    }
    else {
        await mysql.deleteContact(idx);
        data = await mysql.getContacts();
        res.status(200).render("contactlog.pug",{data:data});
    }
})

app.use((req, res, next) => {
    res.set('Content-Type: text/html; charset=utf-8')
    res.status(404).render("404.pug")
  })

app.listen(port, () => {
    console.log(`Website being hosted on http://localhost:${port}/`)
})