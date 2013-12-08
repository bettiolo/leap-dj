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

	djConsole.leftTrack.setSrc('music/track1.mp3');
	djConsole.rightTrack.setSrc('music/track3.mp3');
	djConsole.leftTrack.play();
	djConsole.rightTrack.play();
}