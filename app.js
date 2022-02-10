var express = require("express");
var path = require("path");
var mysql  = require("mysql");
const bodyParser = require("body-parser");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "eztransport"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

var app = express();

app.use(express.static(__dirname + '/public'));
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));


app.use("/", require("./routes/web"));


app.listen(app.get("port"), function(){
    console.log("Server started on port " + app.get("port"));
})
