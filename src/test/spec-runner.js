(function () {
	var jasmineEnv = jasmine.getEnv(),
		htmlReporter = new jasmine.HtmlReporter();

	jasmineEnv.updateInterval = 250;
	jasmineEnv.addReporter(htmlReporter);
	jasmineEnv.specFilter = function (spec) {
		return htmlReporter.specFilter(spec);
	};

	var currentWindowOnload = window.onload;
	window.onload = function () {
		if (currentWindowOnload) {
			currentWindowOnload();
		}
		jasmineEnv.execute();
	};

})();