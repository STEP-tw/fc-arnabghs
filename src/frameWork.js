const isMatching = (req, route) => {
	if (route.method && req.method != route.method) return false;
	if (route.url instanceof RegExp && route.url.test(req.url)) return true;
	if (route.url && req.url != route.url) return false;
	return true;
};

class WebFrame {
	constructor() {
		this.routes = [];
	}
	use(handler) {
		this.routes.push({ handler });
	}
	get(url, handler) {
		this.routes.push({ method: "GET", url, handler });
	}
	post(url, handler) {
		this.routes.push({ method: "POST", url, handler });
	}
	handleRequest(req, res) {
		let matchingRoutes = this.routes.filter(route => isMatching(req, route));
		matchingRoutes[0].handler(req, res);
	}
}

module.exports = WebFrame;