//Not using
const {BrowserRouter, Link, Route, Switch} = ReactRouterDOM;
const Router = BrowserRouter;
const {useRouteMatch, useParams, useLocation} = ReactRouterDOM;

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
	"2":"YELLOW",
	"3":"GREEN",
	"-1":"Not applicable"
};

class App extends React.Component {
	render() {
		return (
			<>
			<h1>Journey time indicators</h1>
			<p>{LOCATION_ID.H1}</p>
			<p>{loc[1].latitude}</p>
			</>
		)
	}
}

ReactDOM.render(<App name="Journey time indicators"/>, document.querySelector("#app"));