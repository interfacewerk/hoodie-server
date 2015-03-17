var helpers = {
	isMobileApplication: function (request) {
		var isMobile = request.headers['user-agent'].toLowerCase().indexOf('android') !== -1;
		return isMobile ? 'www/js/lib/cordova/cordova.js' : 'www/js/lib/cordova/cordova_empty.js';
	}
};

exports.register = function (plugin, options, next) {
	plugin.select('web').route([{
		method: 'GET',
		path: '/{p*}',
		handler: {
			directory: {
				path: function (request) {
					return options.app.www_root;
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