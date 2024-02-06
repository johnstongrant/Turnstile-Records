// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "127.0.0.1",// this will work
  user: "C4131F23U99",
  database: "C4131F23U99",
  password: "9851", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

async function addContact(data){
  const name = data.name_field;
  const email = data.email_field;
  const date = data.date_field;
  const res = data.reason;
  const payment = data.check_field;
  let addThis = "INSERT INTO contact (contactName, contactEmail, aptDate, reason, cash) VALUES (?,?,?,?,?)"
  connPool.awaitQuery(addThis, [name,email,date,res,payment]);
}

async function deleteContact(id){
  const del = "DELETE FROM contact WHERE id=?"
  try {
    connPool.awaitQuery(del,[id]);
  } catch (error) {
    return -1;
  }
  
}

async function getContacts() {
  return await connPool.awaitQuery('SELECT * FROM contact')
}

async function addSale(message) {
  return await connPool.awaitQuery("INSERT INTO sale (saleText) VALUES (?)", [message]);
}

async function endSale() {
  return await connPool.awaitQuery("update sale set timeEnded=CURRENT_TIMESTAMP WHERE timeEnded IS NULL")
}

async function getRecentSales() {
  return await connPool.awaitQuery("select * from sale order by timeCreated desc limit 3")
}

module.exports = {addContact, getContacts, deleteContact, addSale, endSale, getRecentSales}