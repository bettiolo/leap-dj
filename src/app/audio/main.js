var currentWindowOnload = window.onload;
window.onload = function () {
	if (currentWindowOnload) {
		currentWindowOnload();
	}
	init();
};

function init() {
	var djConsole = new DjConsole();
	var ui = new Ui(djConsole);

	djConsole.leftTrack.setSrc('music/track4.mp3');
	djConsole.rightTrack.setSrc('music/track5.mp3');
	djConsole.leftTrack.play();
	djConsole.rightTrack.play();
}