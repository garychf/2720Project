/*
Chan Hon Fung  1155124829
Liu Kam Nam    1155109652
Lai Chun Hei   1155143433
Au Chun Hei    1155125607
Shea Wing Tung 1155126215
*/

const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const convert = require('xml-js');
const fetch = require('node-fetch');

mongoose.connect("mongodb://s1155124829:x33813@localhost/s1155124829");
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extened: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(cookieSession({keys: ["JSONToBeImplemented"],}));

const LocSchema =  new mongoose.Schema({
  id: {type: String,unique: true,required: true},
  name: {type: String,required: true},
  latitude: {type: Number,required: true},
  longitude: {type: Number,required: true},
  comment: [{user: String, body: String}]
});

var Loc = mongoose.model('Loc', LocSchema);


const UserSchema =  new mongoose.Schema({
	username: {type: String, require: true, unique: true},
	password: {type: String, require: true},
	fav: [{place: String}]
});

var User = mongoose.model('User', UserSchema);

var authenticateUser = (req, res, next) => {
  if (!req.session.user) {
    res.send("Please log in first");
    return;
  }
  next();
};



const url = 'https://resource.data.one.gov.hk/td/journeytime.xml';

const LOCATION_ID={
	"H1": "Gloucester Road eastbound near the Revenue Tower",
	"H2": "Canal Road Flyover northbound near exit of Aberdeen Tunnel",
	"H3": "Island Eastern Corridor westbound near City Garden",
	"H11": "Island Eastern Corridor westbound near Lei King Wan",
	"K01": "Ferry Street southbound near Charming Gardena",
	"K02": "Gascoigne Road eastbound near the Hong Kong Polytechnic University",
	"K03": "Waterloo Road southbound near Kowloon Hospital",
	"K04": "Princess Margaret Road southbound near Oi Man Estate",
	"K05": "Kai Fuk Road northbound near the petrol stations",
	"K06": "Chatham Road North southbound near Fat Kwong Street Playground",
	"SJ1": "Tai Po Road – Sha Tin near the Racecourse",
	"SJ2": "Tate’s Cairn Highway near Shek Mun",
	"SJ3": "Tolo Highway near Science Park",
	"SJ4": "San Tin Highway near Pok Wai Road",
	"SJ5": "Tuen Mun Road near Tuen Mun Heung Sze Wui Road"
};
const ch={
	"H1": 0,
	"H2": 1,
	"H3": 2,
	"H11": 3,
	"K01": 4,
	"K02": 5,
	"K03": 6,
	"K04": 7,
	"K05": 8,
	"K06": 9,
	"SJ1": 10,
	"SJ2": 11,
	"SJ3": 12,
	"SJ4": 13,
	"SJ5": 14
}
const loc=[
	{id:"H1", name:"Gloucester Road eastbound near the Revenue Tower", latitude: 22.279311622, longitude: 114.172101664},
	{id:"H2", name:"Canal Road Flyover northbound near exit of Aberdeen Tunnel", latitude: 22.271587756, longitude: 114.180185283},
	{id:"H3", name:"Island Eastern Corridor westbound near City Garden", latitude: 22.292018819, longitude: 114.193869616},
	{id:"H11", name:"Island Eastern Corridor westbound near Lei King Wan", latitude: 22.285235888, longitude: 114.221346549},
	{id:"K01", name:"Ferry Street southbound near Charming Gardena", latitude: 22.315044916, longitude: 114.166786346},
	{id:"K02", name:"Gascoigne Road eastbound near the Hong Kong Polytechnic University", latitude: 22.305896494, longitude: 114.178474746},
	{id:"K03", name:"Waterloo Road southbound near Kowloon Hospital", latitude: 22.324182195, longitude: 114.178378266},
	{id:"K04", name:"Princess Margaret Road southbound near Oi Man Estate", latitude: 22.31331063, longitude: 114.176931903},
	{id:"K05", name:"Kai Fuk Road northbound near the petrol stations", latitude: 22.319902728, longitude: 114.206732056},
	{id:"K06", name:"Chatham Road North southbound near Fat Kwong Street Playground", latitude: 22.309177485, longitude: 114.184084134},
	{id:"SJ1", name:"Tai Po Road – Sha Tin near the Racecourse", latitude: 22.404797024, longitude: 114.20734796},
	{id:"SJ2", name:"Tate’s Cairn Highway near Shek Mun", latitude: 22.389757785, longitude: 114.210593926},
	{id:"SJ3", name:"Tolo Highway near Science Park", latitude: 22.426975789, longitude: 114.206972621},
	{id:"SJ4", name:"San Tin Highway near Pok Wai Road", latitude: 22.464106829, longitude: 114.053710459},
	{id:"SJ5", name:"Tuen Mun Road near Tuen Mun Heung Sze Wui Road", latitude: 22.401075772, longitude: 113.97722659},
];


const DESTINATION_ID={
	"CH": "Cross Harbour Tunnel",
	"EH": "Eastern Harbour Crossing",
	"WH": "Western Harbour Crossing",
	"LRT": "Lion Rock Tunnel",
	"SMT": "Shing Mun Tunnel",
	"TCT": "Tate's Cairn Tunnel",
	"TKTL": "Ting Kau, via Tai Lam Tunnel",
	"TKTM": "Ting Kau, via Tuen Mun Road",
	"TSCA": "Tsing Sha Control Area",
	"TWCP": "Tsuen Wan via Castle Peak",
	"TWTM": "Tsuen Wan via Tuen Mun"
};

const COLOUR_ID={
	"1":"Red",
	"2":"Yellow",
	"3":"Green",
	"-1":"Not applicable"
};

app.get("/", (req, res) => {
    res.render("index");
  })
  .get("/login", (req, res) => {
    res.render("login");
  })
  .get("/register", (req, res) => {
    res.render("register");
  })
  .get("/registerSuccess", (req, res) => {
    res.render("registerSuccess");
  });

//favourite list page
app.get("/fav", authenticateUser, (req, res) => {
	User.findOne({username:req.session.user.username},function(error,u){
		if(error){
			res.send(error);
			return;
		}
		res.render("favPlace", { user: req.session.user ,fa: u.fav});
	});
});

app.get("/home", authenticateUser, (req, res) => {
    Loc.find().toArray(function(err, list) {
    res.render("home", { user: req.session.user, info:list})})
});

//single place page
app.get("/place/:id", authenticateUser, (req, res) => {
	Loc.findOne({id: req.params['id']}, function(err, l){
		if(err){
			res.send(err);
			return;
		}
		if (l==null) {return;}
		fetch(url)
  		.then(resp => resp.text())
    	.then(json => convert.xml2js(json,{ignoreDeclaration: true}))
    	.then(data => data['elements'][0]['elements'])
    	.then(result => {
    		var j = 0;
			var fastest = 1000;
			var advice = -1;
			var ret_data = ["","","","","",""];
    		for(i=0;i<35;i++){
	    		if(result[i]['elements'][0]['elements'][0]['text'] === l.id){
	    			j++;
	    			ret_data[3*j-3] = "Destination " + j + ": " + DESTINATION_ID[result[i]['elements'][1]['elements'][0]['text']];
	    			if(result[i]['elements'][3]['elements'][0]['text'] === "1"){
	    				ret_data[3*j-2] = "The estimated travel time is " + result[i]['elements'][4]['elements'][0]['text'] + " minutes.";
	    				if(parseInt(result[i]['elements'][4]['elements'][0]['text'])<fastest){
	    					fastest = parseInt(result[i]['elements'][4]['elements'][0]['text']);
	    					advice = i;
	    				}
	    			}
	    			else ret_data[3*j-2] = "Traffic congestion!";
	    			ret_data[3*j-1] = "The color code is " + COLOUR_ID[result[i]['elements'][5]['elements'][0]['text']];
	    		}
	    	}
	    	User.findOne({username:req.session.user.username},function(error,u){
	    		if(error){
					res.send(error);
					return;
				}
				var fa = false;
				for(item in u.fav)
					if(l.id === u.fav[item]["place"])
						fa=true;
				res.render("place", { user: req.session.user , id:req.params['id'], name:l.name, latitude:l.latitude, longitude:l.longitude, res: ret_data, num: j, time: result[0]['elements'][2]['elements'][0]['text'] , fastest:fastest, advice: DESTINATION_ID[result[advice]['elements'][1]['elements'][0]['text']] ,comment:l.comment , fa:fa});
	    	});
    	});
	});
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.send("You have not filled in all the fields");
      return;
    }

    const user = await User.findOne({ username });
    if (!user) {
      res.send("invalid username or password");
      return;
    }

    const pwCheck = await bcrypt.compare(password,user.password);
    if (!pwCheck) {
      res.send("Password is wrong");
      return;
    }

    req.session.user = {
      username,
    };
    res.redirect("/home");
});

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.send("Please enter all the fields");
      return;
    }

    const user = await User.findOne({ username });
    if (user) {
      res.send("The username is taken");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, password: hashedPassword });

    newUser.save().then(() => {
        res.redirect("/registerSuccess");
        return;
      })
      .catch((err) => console.log(err));
});

app.get("/logout", authenticateUser, (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});

//create loc from db
app.post('/loc', function(req, res){
	var l = new Loc ({id: req.body['id'], name: req.body['name'], latitude: req.body['latitude'], longitude: req.body['longitude']});
	l.save(function(err){
		if (err){
			res.send(err);
			return;
		}
		res.send(l);
	});
});

//read loc from db
app.get('/loc', function(req, res){
	Loc.findOne({id: req.body['id']}, function(err, l){
		if(err){
			res.send(err);
			return;
		}
		res.send("Location ID: " + l.id + "<br>\n" + "Loaction Name: " + l.name + "<br>\n" + "Latitude: " + l.latitude + "<br>\n" + "Longitude: " + l.longitude + "Ref: " + l);
	});
});

//edit loc from db
app.put('/loc', function(req, res){
	Loc.findOne({id: req.body['id']} , 
		function(err, l){
			if (err){
				res.send(err);
				return;
			}
			l.name = req.body['name'];
			l.latitude = req.body['latitude'];
			l.longitude = req.body['longitude'];
			l.save();
			res.send(l);
		});
});

//delete loc from db
app.delete('/loc', function(req, res){
	Loc.findOne({id: req.body['id']}, 'id name latitude longitude', function(err, l){
		if(err){
			res.send(err);
			return;
		}
		res.send("Location ID: " + l.id + "<br>\n" + "Loaction Name: " + l.name + "<br>\n" + "Latitude: " + l.latitude + "<br>\n" + "Longitude: " + l.longitude + "<br>\n" + "is successfully deleted." + "<br>\n" + "Ref: " + l);
		l.remove();
	});
});

//create user from db
app.post('/user', function(req, res){
	var u = new User ({username: req.body['username'], password: req.body['password']});
	u.save(function(err){
		if (err){
			res.send(err);
			return;
		}
		res.send(u);
	});
});

//read user from db
app.get('/user', function(req, res){
	User.findOne({username: req.body['username']},function(err, u){
		if(err){
			res.send(err);
			return;
		}
		res.send("Username: " + u.username + "<br>\n" + "Password" + u.password + "<br>\n" + "Favourite Place" + u.fav + "Ref: " + u);
	});
});

//edit user from db
app.put('/user', function(req, res){
	User.findOne({username: req.body['username']},
		function(err,u){
			if(err){
				res.send(err);
				return;
			}
			u.password = req.body['password']; 
			u.fav = req.body['favPlace'];
			u.save();
			res.send(u);
		});
});

//delete user from db
app.delete('/user', function(req, res){
	User.findOne({username: req.body['username']}, 'username password favPlace', function(err, u){
		if(err){
			res.send(err);
			return;
		}
		res.send("Username: " + u.username + "<br>\n" + "Password" + u.password + "<br>\n" + "Favourite Place" + u.fav + "<br>\n" + "is successfully deleted." + "<br>\n" + "Ref: " + u);
		u.remove();
	});
});

//add to favourite
app.post('/fav', function(req, res){
	User.update(
	    {username: req.body['user']}, 
	    { $push: { fav: {place : req.body['id']} } },
	    function (error, success) {
	        if (error) {
	            res.send(error);
	        } else {
	            res.send(success);
	        }
    	}
	);
});

//remove from favourite
app.put('/remfav', function(req, res){
	User.update(
	    {username: req.body['user']}, 
	    { $pull: { fav: {place: req.body['id']} } },
	    function (error, success) {
	        if (error) {
	            res.send(error);
	        } else {
	            res.send(success);
	        }
    	}
	);


});

//leave new comment
app.put('/putloc/:id', function(req, res){
	var newcom = { user: req.body['user'], body: req.body['body'] };
	Loc.update(
	    {id: req.params['id']}, 
	    { $push: { comment: newcom } },
	    function (error, success) {
	        if (error) {
	            console.log(error);
	        } else {
	            console.log(success);
	        }
    	}
	);
});

const server = app.listen(2073);
// server config

