var helpers = {
	isMobileApplication: function (request) {
		var isMobile = request.headers['user-agent'].toLowerCase().indexOf('android') !== -1;
		return isMobile ? 'www/js/lib/cordova/cordova.js' : 'www/js/lib/cordova/cordova_empty.js';
	},
	authenticateRequest: function (options, request, success_path, failure_path) {
		var headers = request.headers['user-agent'].split('|AUTH:');
		var remote_ip = request.info.remoteAddress;
		if (headers.length === 2 && headers[1] === options.app.auth_token || remote_ip.substr(0, 4) === '127.' || remote_ip.substr(0, 8) === '192.168.' || remote_ip.substr(0, 3) === '10.') {
			return success_path;
		} else {
			return failure_path;
		}
	}
};

exports.register = function (plugin, options, next) {
	plugin.select('web').route([{
		method: 'GET',
		path: '/{p*}',
		handler: {
			directory: {
				path: function (request) {
					return helpers.authenticateRequest(options, request, options.app.www_root, 'www/empty');
				},
				listing: false,
				index: true
			}
		}
	}, {
		method: 'GET',
		path: '/js/lib/cordova/cordova.js',
		handler: {
			file: function (request) {
				return helpers.isMobileApplication(request);
			}
		}
	}]);

	return next();
};

exports.register.attributes = {
	pkg: require('./package.json')
};