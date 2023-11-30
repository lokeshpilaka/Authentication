const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");
app.use(express.json());

const dbPath = path.join(__dirname, "userData.db");
db = null;
const initializeDBAndServer = () => {
  try {
    db = open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(e.message);
  }
};

initializeDBAndServer();

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectRegisterQuery = `
  SELECT * FROM user WHERE username = '${username}';
  `;
  const dbUser = await db.get(electRegisterQuery);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO user (username, name, password, gender, location)
      VALUES('${username}','${name}','${hashedPassword}','${gender}','${location}')
      `;
    await db.run(createUserQuery);
    response.send("User created Successfully");
  } else {
    response.status(400);
    response.send("User already exists");
  }
  if (password.length < 5) {
    response.send("Password is too short");
  }
});

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const selectRegisterQuery = `
  SELECT * FROM user WHERE username = '${username}';
  `;
  const dbUser = await db.get(selectRegisterQuery);
  if (dbUser === undefined) {
    response.status(400);
    response.send("Invalid user");
  } else {
    const isPasswordMatch = await bcrypt.compare(password, dbUser.password);
    if (sPasswordMatch === true) {
      response.send("Login success!");
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

app.put("/change-password", async (request, response) => {
  const { username, oldPassword, newPassword } = request.body;
  const updateQuery = `
  UPDATE user SET username = ${username},
                  oldPassword = ${oldPassword},
                  newPassword = ${newPassword}
  WHERE username = ${username}                
  `;
  const dbUser = db.run(updateQuery);
  if (newPassword.length < 5) {
    response.status(400);
    response.send("Password is too short");
  } else {
    response.send(200);
    response.send("Password updated");
  }
});

module.exports = app;
