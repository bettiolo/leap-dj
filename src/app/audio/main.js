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
		var firstRandomTrack = Math.floor((Math.random() * sc.tracks.length) + 1);
		var secondRandomTrack = Math.floor((Math.random() * sc.tracks.length) + 1);
		djConsole.leftTrack.set(sc.tracks[firstRandomTrack]);
		djConsole.rightTrack.set(sc.tracks[secondRandomTrack]);
		djConsole.leftTrack.play();
		djConsole.rightTrack.play();
	});
}