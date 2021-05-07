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
const url2 = 'https://api.data.gov.hk/v1/historical-archive/get-file?url=https%3A%2F%2Fresource.data.one.gov.hk%2Ftd%2Fjourneytime.xml&time=';
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
	"SJ2": "Tates Cairn Highway near Shek Mun",
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
	"TCT": "Tates Cairn Tunnel",
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
    if(req.session.user.username==="admin")
	res.render("admin", { user: req.session.user});
    Loc.find({}, function(err, list) {
    var i=0;
    var id = {};
    var name = {};
    var lat = {};
    var long = {};
    list.forEach(function(p) {
      id[i] = p.id;
      name[i]=p.name;
      lat[i]=p.latitude;
      long[i]=p.longitude;
      i++
    });
    res.send("home",{pid:id,pname:name,plat:lat,plong:long});
  });
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
			var ret_data = [];
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
	    			ret_data[3*j-1] = COLOUR_ID[result[i]['elements'][5]['elements'][0]['text']];
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
			res.send("Location cannot be created, please check the input again!");
			return;
		}
		res.send("Location with ID "+l.id+", name "+l.name+", latitude "+l.latitude+" and longitude "+l.longitude+" created.");
	});
});

//read all user loc from db
app.get('/loc',function(req,res){
	Loc.find({})
	.exec(function(err,l){
		if (err) {res.send(err); return;}
		if(l.length==0){
	      res.send("There are no location!");
	      return;
    	}
    	var num = 0;
	    var response="";
	    while(num < l.length){
	    	num +=1;
	      	response = response +"Location "+num +" id : "+l[num-1].id+"<br>";
	    }
	    res.send(response);
	});
});

//read loc from db
app.get('/loc/:id', function(req, res){
	Loc.findOne({id: req.params['id']}, function(err, l){
		if(err){
			res.send("Fail to read.");
			return;
		}
		if(l===null){
			res.send("There is no such a location.");
			return;
		}
		res.send("The Location ID is "+l.id+", name is "+l.name+", latitude is "+l.latitude+" and longitude is "+l.longitude+".");
	});
});

//initial check for edit loc
app.put('/loc', function(req, res){
	Loc.findOne({id: req.body['id']} , 
		function(err, l){
			if (err){
				res.json({init:false});
				return;
			}
			if (l===null){
				res.json({init:false});
				return;
			}
			res.json({init:true,name:l.name,lat:l.latitude,lon:l.longitude});
		});
});

//edit loc from db
app.put('/loc/:id', function(req, res){
	Loc.findOne({id: req.params['id']} , 
		function(err, l){
			if (err){
				res.json({init:false});
				return;
			}
			if (l===null){
				res.json({init:false});
				return;
			}
			l.name = req.body['name'];
			l.latitude = req.body['latitude'];
			l.longitude = req.body['longitude'];
			l.save();
			res.json({init:true,name:l.name,lat:l.latitude,lon:l.longitude});
		});
});

//delete loc from db
app.delete('/loc', function(req, res){
	Loc.findOne({id: req.body['id']}, function(err, l){
		if(err){
			res.send("Fail to delete.");
			return;
		}
		if(l===null){
			res.send("There is no such a location.");
			return;
		}
		res.send("Location with ID "+l.id+", name "+l.name+", latitude "+l.latitude+" and longitude "+l.longitude+" deleted.");
		l.remove();
	});
});

//create user from db
app.post('/user', function(req, res){
	var u = new User ({username: req.body['username'], password: req.body['password']});
	u.save(function(err){
		if (err){
			res.send("User cannot be created, please check the input again!");
			return;
		}
		res.send("User with username "+u.username+" and password "+u.password+" is created.");
	});
});

//read all user from db
app.get('/user', function(req, res){
	User.find({})
	.exec(function(err,u){
		if (err) {res.send(err); return;}
		if(u.length==0){
	      res.send("There are no user!");
	      return;
    	}
    	var num = 0;
	    var response="";
	    while(num < u.length){
	    	num +=1;
	      	response = response +"User "+num +" username : "+u[num-1].username+"<br>";
	    }
	    res.send(response);
	});
});

//read user from db
app.get('/user/:username', function(req, res){
	User.findOne({username: req.params['username']}, function(err, u){
		if(err){
			res.send("Fail to read.");
			return;
		}
		if(u===null){
			res.send("There is no such a user.");
			return;
		}
		res.send("The User username is "+u.username+" and password is "+u.password+".");
	});
});

//initial check for edit user
app.put('/user', function(req, res){
	User.findOne({username: req.body['username']} , 
		function(err, u){
			if (err){
				res.json({init:false});
				return;
			}
			if (u===null){
				res.json({init:false});
				return;
			}
			res.json({init:true,username:u.username,password:u.password});
		});
});

//edit user from db
app.put('/user/:username', function(req, res){
	User.findOne({username: req.params['username']} , 
		function(err, u){
			if (err){
				res.json({init:false});
				return;
			}
			if (u===null){
				res.json({init:false});
				return;
			}
			u.password = req.body['password'];
			u.save();
			res.json({init:true,password:u.password});
		});
});

//delete user from db
app.delete('/user', function(req, res){
	User.findOne({username: req.body['username']},function(err, u){
		if(err){
			res.send("Fail to delete.");
			return;
		}
		if(u===null){
			res.send("There is no such a user.");
			return;
		}
		res.send("User with username "+u.username+" and password "+u.password+" deleted.");
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
	            res.send(error);
	        } else {
	            res.send(success);
	        }
    	}
	);
});

//display info for favourite page
app.get('/fast/:id',function(req,res){
	Loc.findOne({id: req.params['id']}, function(err, l){
		if(err){
			res.send(err);
			return;
		}
		fetch(url)
  		.then(resp => resp.text())
    	.then(json => convert.xml2js(json,{ignoreDeclaration: true}))
    	.then(data => data['elements'][0]['elements'])
    	.then(result => {
    		var j = 0;
			var fastest = 1000;
			var advice = -1;
    		for(i=0;i<35;i++){
	    		if(result[i]['elements'][0]['elements'][0]['text'] === l.id){
	    			j++;
	    			if(result[i]['elements'][3]['elements'][0]['text'] === "1"){
	    				if(parseInt(result[i]['elements'][4]['elements'][0]['text'])<fastest){
	    					fastest = parseInt(result[i]['elements'][4]['elements'][0]['text']);
	    					advice = i;
	    				}
	    			}
	    		}
	    	}
	    	res.send({fastest:fastest, advice: DESTINATION_ID[result[advice]['elements'][1]['elements'][0]['text']], name:l.name});
	    });
	});
});

//chart for 10 hours
app.get('/chart/:id', authenticateUser,function(req,res){
	Loc.findOne({id: req.params['id']}, function(err, l){
		if(err){
			res.send(err);
			return;
		}
		var ret=[[],[],[]]
		var name=[];
		var index=[];
		var t=[];
		var j=0;
		var h = 60*60*1000;
		var time = new Date(Date.now());
		var year = time.getFullYear().toString();
	  	var month = (time.getMonth()+1).toString();
	  	if(month.length===1){month="0"+month}
	  	var date = time.getDate().toString();
	  	if(date.length===1){date="0"+date}
	  	var hour = time.getHours().toString();
	  	if(hour.length===1){hour="0"+hour}
	  	var min = time.getMinutes().toString();
	  	if(min.length===1){min="0"+min}
		fetch(url).then(resp => resp.text()).then(json => convert.xml2js(json,{ignoreDeclaration: true})).then(data => data['elements'][0]['elements']).then(result => {
	  		t[0]=hour+min;
	  		for(i=0;i<35;i++){
	    		if(result[i]['elements'][0]['elements'][0]['text'] === l.id){
	    			index[j]=i;
	    			name[j]=DESTINATION_ID[result[i]['elements'][1]['elements'][0]['text']];
	    			if(result[i]['elements'][3]['elements'][0]['text'] === "1")
	    				ret[j][0]=parseInt(result[i]['elements'][4]['elements'][0]['text']);
	    			else ret[j][0] = 0;
	    			j++;
	    		}
	    	}
	  		fetch(url2+year+month+date+"-"+hour+min).then(resp2 => resp2.text()).then(json2 => convert.xml2js(json2,{ignoreDeclaration: true})).then(data2 => data2['elements'][0]['elements']).then(result2 => {
		    	time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}hour = time.getHours().toString();if(hour.length===1){hour="0"+hour}
		    	t[1]=hour+min;

		    	for(i=0;i<index.length;i++){
	    			if(result2[i]['elements'][3]['elements'][0]['text'] === "1")
	    				ret[i][1]=parseInt(result2[index[i]]['elements'][4]['elements'][0]['text']);
	    			else ret[i][1] = 0;
	    		}
		  		fetch(url2+year+month+date+"-"+hour+min).then(resp3 => resp3.text()).then(json3 => convert.xml2js(json3,{ignoreDeclaration: true})).then(data3 => data3['elements'][0]['elements']).then(result3 => {
			    	time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}hour = time.getHours().toString();if(hour.length===1){hour="0"+hour}
			  		t[2]=hour+min;
			  		for(i=0;i<index.length;i++){
		    			if(result3[i]['elements'][3]['elements'][0]['text'] === "1")
		    				ret[i][2]=parseInt(result3[index[i]]['elements'][4]['elements'][0]['text']);
		    			else ret[j][2] = 0;
		    		}
			  		fetch(url2+year+month+date+"-"+hour+min).then(resp4 => resp4.text()).then(json4 => convert.xml2js(json4,{ignoreDeclaration: true})).then(data4 => data4['elements'][0]['elements']).then(result4 => {
					    time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}hour = time.getHours().toString();if(hour.length===1){hour="0"+hour}
					    t[3]=hour+min;
					    for(i=0;i<index.length;i++){
			    			if(result4[i]['elements'][3]['elements'][0]['text'] === "1")
			    				ret[i][3]=parseInt(result4[index[i]]['elements'][4]['elements'][0]['text']);
			    			else ret[j][3] = 0;
			    		}
					  	fetch(url2+year+month+date+"-"+hour+min).then(resp5 => resp5.text()).then(json5 => convert.xml2js(json5,{ignoreDeclaration: true})).then(data5 => data5['elements'][0]['elements']).then(result5 => {
						    time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}hour = time.getHours().toString();if(hour.length===1){hour="0"+hour}
						    t[4]=hour+min;
						    for(i=0;i<index.length;i++){
				    			if(result5[i]['elements'][3]['elements'][0]['text'] === "1")
				    				ret[i][4]=parseInt(result5[index[i]]['elements'][4]['elements'][0]['text']);
				    			else ret[j][4] = 0;
				    		}
						  	fetch(url2+year+month+date+"-"+hour+min).then(resp6 => resp6.text()).then(json6 => convert.xml2js(json6,{ignoreDeclaration: true})).then(data6 => data6['elements'][0]['elements']).then(result6 => {
							    time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}hour = time.getHours().toString();if(hour.length===1){hour="0"+hour}
							    t[5]=hour+min;
							    for(i=0;i<index.length;i++){
					    			if(result6[i]['elements'][3]['elements'][0]['text'] === "1")
					    				ret[i][5]=parseInt(result6[index[i]]['elements'][4]['elements'][0]['text']);
					    			else ret[j][5] = 0;
					    		}
						  		fetch(url2+year+month+date+"-"+hour+min).then(resp7 => resp7.text()).then(json7 => convert.xml2js(json7,{ignoreDeclaration: true})).then(data7 => data7['elements'][0]['elements']).then(result7 => {
								    time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}hour = time.getHours().toString();if(hour.length===1){hour="0"+hour}
								    t[6]=hour+min;
								    for(i=0;i<index.length;i++){
						    			if(result7[i]['elements'][3]['elements'][0]['text'] === "1")
						    				ret[i][6]=parseInt(result7[index[i]]['elements'][4]['elements'][0]['text']);
						    			else ret[j][6] = 0;
						    		}
								  	fetch(url2+year+month+date+"-"+hour+min).then(resp8 => resp8.text()).then(json8 => convert.xml2js(json8,{ignoreDeclaration: true})).then(data8 => data8['elements'][0]['elements']).then(result8 => {
									    time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}hour = time.getHours().toString();if(hour.length===1){hour="0"+hour}
									  	t[7]=hour+min;
									  	for(i=0;i<index.length;i++){
							    			if(result8[i]['elements'][3]['elements'][0]['text'] === "1")
							    				ret[i][7]=parseInt(result8[index[i]]['elements'][4]['elements'][0]['text']);
							    			else ret[j][7] = 0;
							    		}
									  	fetch(url2+year+month+date+"-"+hour+min).then(resp9 => resp9.text()).then(json9 => convert.xml2js(json9,{ignoreDeclaration: true})).then(data9 => data9['elements'][0]['elements']).then(result9 => {
									    	time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}hour = time.getHours().toString();if(hour.length===1){hour="0"+hour}
									    	t[8]=hour+min;
									    	for(i=0;i<index.length;i++){
								    			if(result9[i]['elements'][3]['elements'][0]['text'] === "1")
								    				ret[i][8]=parseInt(result9[index[i]]['elements'][4]['elements'][0]['text']);
								    			else ret[j][8] = 0;
								    		}
									  		fetch(url2+year+month+date+"-"+hour+min).then(resp10 => resp10.text()).then(json10 => convert.xml2js(json10,{ignoreDeclaration: true})).then(data10 => data10['elements'][0]['elements']).then(result10 => {
										    	time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}hour = time.getHours().toString();if(hour.length===1){hour="0"+hour}
										    	t[9]=hour+min;
										    	for(i=0;i<index.length;i++){
									    			if(result10[i]['elements'][3]['elements'][0]['text'] === "1")
									    				ret[i][9]=parseInt(result10[index[i]]['elements'][4]['elements'][0]['text']);
									    			else ret[j][9] = 0;
									    		}
									    		ret[0]=ret[0].reverse();
									    		ret[1]=ret[1].reverse();
									    		ret[2]=ret[2].reverse();
									    		t=t.reverse();
										  		res.render("chart", { user: req.session.user, ret:ret, name:name, me:l.name, time:t,id:l.id});
											});
										});	
									});
								});
							});
						});
					});
				});
			});
		});
	});
});

//chart for 7 days
app.get('/chart2/:id', authenticateUser,function(req,res){
	Loc.findOne({id: req.params['id']}, function(err, l){
		if(err){
			res.send(err);
			return;
		}
		var ret=[[],[],[]]
		var name=[];
		var index=[];
		var t=[];
		var j=0;
		var h = 24*60*60*1000;
		var time = new Date(Date.now());
		var year = time.getFullYear().toString();
		var month = (time.getMonth()+1).toString();
		if(month.length===1){month="0"+month}
		var date = time.getDate().toString();
		if(date.length===1){date="0"+date}
		var hour = time.getHours().toString();
		if(hour.length===1){hour="0"+hour}
		var min = time.getMinutes().toString();
		if(min.length===1){min="0"+min}
		fetch(url).then(resp => resp.text()).then(json => convert.xml2js(json,{ignoreDeclaration: true})).then(data => data['elements'][0]['elements']).then(result => {
		  	t[0]=month+date;
		  	for(i=0;i<35;i++){
		    		if(result[i]['elements'][0]['elements'][0]['text'] === l.id){
		    			index[j]=i;
		    			name[j]=DESTINATION_ID[result[i]['elements'][1]['elements'][0]['text']];
		    			if(result[i]['elements'][3]['elements'][0]['text'] === "1")
		    				ret[j][0]=parseInt(result[i]['elements'][4]['elements'][0]['text']);
		    			else ret[j][0] = 0;
		    			j++;
		    		}
		    }
		    fetch(url2+year+month+date+"-"+hour+min).then(resp2 => resp2.text()).then(json2 => convert.xml2js(json2,{ignoreDeclaration: true})).then(data2 => data2['elements'][0]['elements']).then(result2 => {
			    time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}
			    t[1]=month+date;
			    for(i=0;i<index.length;i++){
		    		if(result2[i]['elements'][3]['elements'][0]['text'] === "1")
		    			ret[i][1]=parseInt(result2[index[i]]['elements'][4]['elements'][0]['text']);
		    		else ret[i][1] = 0;
		    	}
		    	fetch(url2+year+month+date+"-"+hour+min).then(resp3 => resp3.text()).then(json3 => convert.xml2js(json3,{ignoreDeclaration: true})).then(data3 => data3['elements'][0]['elements']).then(result3 => {
				    time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}
				    t[2]=month+date;
				    for(i=0;i<index.length;i++){
			    		if(result3[i]['elements'][3]['elements'][0]['text'] === "1")
			    			ret[i][2]=parseInt(result3[index[i]]['elements'][4]['elements'][0]['text']);
			    		else ret[i][2] = 0;
			    	}
			    	fetch(url2+year+month+date+"-"+hour+min).then(resp4 => resp4.text()).then(json4 => convert.xml2js(json4,{ignoreDeclaration: true})).then(data4 => data4['elements'][0]['elements']).then(result4 => {
				    	time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}
				    	t[3]=month+date;
				    	for(i=0;i<index.length;i++){
				    		if(result4[i]['elements'][3]['elements'][0]['text'] === "1")
				    			ret[i][3]=parseInt(result4[index[i]]['elements'][4]['elements'][0]['text']);
				    		else ret[i][3] = 0;
				    	}
				    	fetch(url2+year+month+date+"-"+hour+min).then(resp5 => resp5.text()).then(json5 => convert.xml2js(json5,{ignoreDeclaration: true})).then(data5 => data5['elements'][0]['elements']).then(result5 => {
					    	time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}
					    	t[4]=month+date;
					    	for(i=0;i<index.length;i++){
					    		if(result5[i]['elements'][3]['elements'][0]['text'] === "1")
					    			ret[i][4]=parseInt(result5[index[i]]['elements'][4]['elements'][0]['text']);
					    		else ret[i][4] = 0;
					    	}
					    	fetch(url2+year+month+date+"-"+hour+min).then(resp6 => resp6.text()).then(json6 => convert.xml2js(json6,{ignoreDeclaration: true})).then(data6 => data6['elements'][0]['elements']).then(result6 => {
						    	time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}
						    	t[5]=month+date;
						    	for(i=0;i<index.length;i++){
						    		if(result6[i]['elements'][3]['elements'][0]['text'] === "1")
						    			ret[i][5]=parseInt(result6[index[i]]['elements'][4]['elements'][0]['text']);
						    		else ret[i][5] = 0;
						    	}
						    	fetch(url2+year+month+date+"-"+hour+min).then(resp7 => resp7.text()).then(json7 => convert.xml2js(json7,{ignoreDeclaration: true})).then(data7 => data7['elements'][0]['elements']).then(result7 => {
							    	time = new Date(time-h);year = time.getFullYear().toString();month = (time.getMonth()+1).toString();if(month.length===1){month="0"+month}date = time.getDate().toString();if(date.length===1){date="0"+date}
							    	t[6]=month+date;
							    	for(i=0;i<index.length;i++){
							    		if(result7[i]['elements'][3]['elements'][0]['text'] === "1")
							    			ret[i][6]=parseInt(result7[index[i]]['elements'][4]['elements'][0]['text']);
							    		else ret[i][6] = 0;
							    	}
							    	ret[0]=ret[0].reverse();
									ret[1]=ret[1].reverse();
						    		ret[2]=ret[2].reverse();
									t=t.reverse();
							    	res.render("chart2", { user: req.session.user, ret:ret, name:name, me:l.name, time:t,id:l.id});
							    });
						    });
					    });
				    });
		    	});
		    });
		});
	});
});

// server config
const server = app.listen(2073);
