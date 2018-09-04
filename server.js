var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());

var pool = mysql.createPool({
 connectionLimit: 2,
 host: "localhost",
 user: "web",
 password: "8h!u-9jXTæ",
 database: "ntnu",
 debug: false
});

app.get("/hello", function(req, res) {
  res.json({ message: "Hallo Trondheim!" });
});

app.get("/hello2", function(req, res) {
  res.json({ message: "Hallo Trondheim!" });
});

app.get("/person", function(req, res) {
  console.log("Fikk request fra klient");
  pool.getConnection(function(err, connection) {
    console.log("Connected to database");
    if (err) {
      console.log("Feil ved kobling til databasen");
      res.json({ error: "feil ved ved oppkobling" });
    } else {
      connection.query("select navn, alder, adresse from person", function(
        err,
        rows
      ) {
        connection.release();
        if (err) {
          console.log(err);
          res.json({ error: "error querying" });
        } else {
          console.log(rows);
          res.json(rows);
        }
      });
    }
  });
});

app.post("/test", function(req, res) {
  console.log("Got POST request");
  console.log("Navn: " + req.body.navn);
  res.status(200);
  res.json({ message: "success" });
});

app.post("/person", function(req, res) {
  console.log("Got POST request");
  console.log("Navn: " + req.body.navn);
  pool.getConnection(function(err, connection) {
    if (err) {
      console.log("Feil ved oppkobling");
      res.json({ error: "feil ved oppkobling" });
    } else {
      console.log("got connection");
      var values = [req.body.navn, req.body.adresse, req.body.alder];
      connection.query(
        "insert into person (navn,adresse,alder) values (?,?,?)",
        values,
        function(err) {
          if (err) {
            console.log(err);
            res.status(500);
            res.json({ error: "error inserting" });
          } else {
            console.log("insert ok");
            res.send("");
          }
        }
      );
    }
  });
});

var server = app.listen(8080);
