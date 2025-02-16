const mysql = require("mysql2/promise");
const env = require("dotenv");
env.config();

async function connectToDatabase() {
  try {
    const con = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: "app",
    });

    console.log("Connected to the database!");
    return { success: true, connection: con };
  } catch (err) {
    console.log("Error creating connection to the database" + err.stack);
    return { success: false, error: err };
  }
}

async function insertNewUser(
  firstName,
  lastName,
  email,
  birthDate,
  salt,
  hashed_password
) {
  const con = await connectToDatabase();
  if (!con.success) {
    console.log("Error connecting to the database");
    return false;
  }
  try {
    const [results] = await con.connection.query(
      "INSERT INTO users (first_name, last_name, email, birth_date, salt, hashed_password) values(?,?,?,?,?,?)",
      [firstName, lastName, email, birthDate, salt, hashed_password]
    );
    console.log("New user inserted successfully");
    return true;
  } catch {
    console.log("Error inserting new user: " + err.stack);
    return false;
  } finally {
    con.connection.end();
  }
}

module.exports = { connectToDatabase, insertNewUser };
