/*
Chan Hon Fung  1155124829
Liu Kam Nam    1155109652
Lai Chun Hei   1155143433
Au Chun Hei    1155125607
Shea Wing Tung 1155126215
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const convert = require('xml-js');
const fetch = require('node-fetch');
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());


const url = 'https://resource.data.one.gov.hk/td/journeytime.xml';
const map = 'https:'
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


app.get('/te',function(req,res){
	res.send('</body>');
});





app.get('/place/:id', function (req,res) {
	var place = req.params['id'];
	var ret_data = "";
	var j = 0;
	var fastest = 1000;
	var advice = -1;
	fetch(url)
  	.then(resp => resp.text())
    .then(json => convert.xml2js(json,{ignoreDeclaration: true}))
    .then(data => data['elements'][0]['elements'])
    .then(result => {
    	if(!(place in LOCATION_ID))
    		res.send("The place id is incorrect!");
    	else{
	    	for(i=0;i<35;i++){
	    		if(result[i]['elements'][0]['elements'][0]['text'] === place){
	    			j++;
	    			ret_data = ret_data + "<h4>Destination " + j + ": " + DESTINATION_ID[result[i]['elements'][1]['elements'][0]['text']] + " (" + result[i]['elements'][1]['elements'][0]['text'] + ")</h4>";
	    			if(result[i]['elements'][3]['elements'][0]['text'] === "1"){
	    				ret_data = ret_data + "<p>The estimated travel time is " + result[i]['elements'][4]['elements'][0]['text'] + " minutes.</p>";
	    				console.log(parseInt(result[i]['elements'][3]['elements'][0]['text']));
	    				console.log(fastest);
	    				if(parseInt(result[i]['elements'][4]['elements'][0]['text'])<fastest){
	    					fastest = parseInt(result[i]['elements'][4]['elements'][0]['text']);
	    					advice = i;
	    				}
	    			}
	    			else ret_data = ret_data + "<p>Traffic congestion!</p>";
	    			ret_data = ret_data +"<p>The color code is " + COLOUR_ID[result[i]['elements'][5]['elements'][0]['text']] + "</p>"+ "<hr>";
	    		}
	    	}
	    	if(!(advice === -1))
	    		ret_data = ret_data +"<h3>We advise you to choose "+DESTINATION_ID[result[advice]['elements'][1]['elements'][0]['text']]+ ", the travel time is only "+ fastest+ " minutes.</h3>";
	    	ret_data = '<head><style type="text/css">#map {height: 400px;width: 100%;}</style><script>function initMap() { const uluru = { lat: ' + loc[ch[place]]["latitude"] + ',lng:' + loc[ch[place]]["longitude"] + '};const map = new google.maps.Map(document.getElementById("map"), {zoom: 15, center: uluru,});const marker = new google.maps.Marker({position: uluru,map: map,});}</script></head><body><h3>My Google Maps Demo</h3><div id="map"></div><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCekcqFhT86PHg743TdzZmHreypuTzO6C0&callback=initMap&libraries=&v=weekly"async></script>' + "<h3>There are " + j + " destination.</h3>" + ret_data +"<p>Last updated: " + result[0]['elements'][2]['elements'][0]['text'] +"</p></body>";
	    	res.send(ret_data);
    }
	});
});

//0:locationid
//1:destinationid
//2:capturedata
//3journeytype
//4journeydata
//5colourid


app.all('/*', function (req, res) {
	res.send("Test");
});


const server = app.listen(2000);