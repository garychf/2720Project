const {BrowserRouter, Link, Route, Switch} = ReactRouterDOM;
const Router = BrowserRouter;
const {useRouteMatch, useParams, useLocation} = ReactRouterDOM;

class App extends React.Component {
	render() {
		return (
			<>
			<h1>Journey time indicators</h1>
			</>
		)
	}
}

ReactDOM.render(<App name="Journey time indicators"/>, document.querySelector("#app"));