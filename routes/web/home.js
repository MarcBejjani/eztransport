var express = require("express");
var bodyParser = require("body-parser");
var mysql = require("mysql");

var router = express.Router();
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "eztransport"
  });

router.get("/", function(req, res) {
 res.render("home/");
 });
 
 router.get("/home", function(req,res){
     res.render("home/home");
 });

 router.get("/carpool", function(req, res){
    res.render("home/carpool");
 });

router.get("/book",function(req,res){
    var sql = "SELECT*FROM CARPOOL";
    con.query(sql,function(err,result){
        if(err) throw err;

        res.render("home/book",{data:result,length:result.length});
    });
});

router.get("/offer", function(req,res){
    res.render("home/offer");
});

router.post("/offer", function(req,res){
    var email = req.body.email;
    var plate = req.body.plate;
    var model = req.body.model;
    var capacity = req.body.capacity;
    var from = req.body.source;
    var to = req.body.destination;
    var date = req.body.date;
    var clientID = 0;
    
    // var sql = "SELECT clientID FROM CLIENT WHERE email=?";
    // con.query(sql,email,function(err,result){
    //     if(err) throw err;
    //     clientID = result[0].clientID; 
    // });

    var sql = "INSERT INTO CARPOOL(carNumber,model,capacity,source,destination,date) VALUES (?)";
    var values = [plate,model,capacity,from,to,date];
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Succes!");

        res.render("home/home")
    });
                                    
});

router.get("/bus", function(req,res){

    var sql = "SELECT*FROM FOLLOWS";
    con.query(sql,function(err,result){
        if(err) throw err;
        
        res.render("home/bus",{data:result,length:result.length});
    });

});

router.post("/bus", function(req,res){
    var plateNumber = req.body.plateNumber;
    var routeID = req.body.routeID;
    var weekDay = req.body.weekDay;
    var timeFrom = req.body.timeFrom;
    var timeTo = req.body.timeTo;
    var values = [routeID,weekDay,timeFrom];
    
    var sql = "SELECT S.seatNumber,plateNumber FROM FOLLOWS F NATURAL JOIN BUS_SEAT S LEFT JOIN RESERVES R ON S.seatNumber = R.seatNumber"+
    "WHERE F.routeID = ? AND F.weekDay = ? AND F.timeFrom = ? AND clientID IS NULL";

    con.query(sql,values,function(err,result){
        if(err) throw err;

        res.render("home/seats",{
            plate:plateNumber,
            route:routeID,
            weekDay:weekDay,
            timeFrom:timeFrom,
            timeTo:timeTo,
            seats:result,
            length:result.length
        });
    });

});

router.get("/login", function(req,res){
    res.render("home/login")
});

router.post("/login", function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var sql = "SELECT EXISTS(SELECT * FROM CLIENTS WHERE email=? AND password=?) AS yes";
    con.query(sql, [email,password], function (err, result) {
        if (err) throw err;
        if(result[0].yes == 1){
            res.render("home/home")
        }else{
            res.render("home/signup")
        }
      });
});

router.get("/signup", function(req,res){
    res.render("home/signup")
});

router.post("/signup", function(req,res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var repass = req.body.repassword;
    var address = req.body.address;
    var age = req.body.age;
    var gender = req.body.gender;
    
    if(password!=repass){
        res.render("home/signup");
    }else{
        var sql = "INSERT INTO CLIENTS(name,password,email,address,age,gender) VALUES (?)";
        var values = [username,password,email,address,age,gender];
        con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Succes!");
      });

    res.render("home/")
    }
})


 module.exports = router;