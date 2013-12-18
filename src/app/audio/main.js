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
	var leap = new LeapDj(djConsole);

	var sc = new SoundCloud();
	sc.loadTracks(function () {
		djConsole.setTracks(sc.tracks);
		djConsole.playRandomTrack(djConsole.leftPlayer);
		djConsole.playRandomTrack(djConsole.rightPlayer);
	});
}