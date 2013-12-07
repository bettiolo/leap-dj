var currentWindowOnload = window.onload;
window.onload = function () {
	if (currentWindowOnload) {
		currentWindowOnload();
	}
	init();
};

function init() {
	// requesting http://api.soundcloud.com/tracks/6981096.json
	//		url = 'http://api.soundcloud.com/tracks/6981096/stream' +
	//			'?client_id=YOUR_CLIENT_ID';

	var djConsole = new DjConsole();

	document.getElementById("pause-left").addEventListener('click', function() {
		djConsole.leftTrack.toggle();
	});

	document.getElementById("pause-right").addEventListener('click', function() {
		djConsole.rightTrack.toggle();
	});

	document.getElementById("quality-range").addEventListener('change', function(event) {
		djConsole.setQualityFactor(event.target.value / 100);
	});

	document.getElementById("frequency-range").addEventListener('change', function(event) {
		djConsole.setFrequencyFactor(event.target.value / 100);
	});

	document.getElementById("crossfade-range").addEventListener('change', function(event) {
		djConsole.setCrossfade(event.target.value / 100);
	});

	djConsole.leftTrack.setSrc('music/track5.mp3');
	djConsole.rightTrack.setSrc('music/track4.mp3');
	djConsole.leftTrack.play();

}

function DjConsole() {
	this._context = new webkitAudioContext();
	this._gain = new this._context.createGainNode();
	this._gain.connect(this._context.destination);
	this._biquadFilter = this._context.createBiquadFilter();
	this._biquadFilter.connect(this._gain);

	this.leftTrack = new Track(this._context);
	this.leftTrack.connect(this._biquadFilter);

	this.rightTrack = new Track(this._context);
	this.rightTrack.connect(this._biquadFilter);
}

DjConsole.prototype.setQualityFactor = function (percent) {
	percent = Math.min(1.0, Math.max(0.0, percent));
	var value = 40 * percent;
	console.log('quality: ' + percent + '=' + value);
	this._biquadFilter.Q.value = value;
};

DjConsole.prototype.setFrequencyFactor = function (percent) {
	var value = Math.pow(2, 13 * percent);
	console.log('frequency: ' + percent + '=' + value);
	this._biquadFilter.frequency.value = value;
};

DjConsole.prototype.setCrossfade = function (percent) {
	var gain1 = Math.cos(percent * 0.5 * Math.PI);
	var gain2 = Math.cos((1.0 - percent) * 0.5 * Math.PI);
	this.leftTrack.setGain(gain1);
	this.rightTrack.setGain(gain2);
};

function Track(context) {
	this._audio = new Audio();
	this._source = context.createMediaElementSource(this._audio);
	this._gain = context.createGainNode();
	this._source.connect(this._gain);
}

Track.prototype.connect = function (node) {
	this._gain.connect(node);
};

Track.prototype.setSrc = function (src) {
	this._audio.src = src;
};

Track.prototype.play = function () {
	this._audio.play();
};

Track.prototype.pause = function () {
	this._audio.pause();
};

Track.prototype.toggle = function () {
	if (this.isPaused()) {
		this.play();
	} else {
		this.pause();
	}
};

Track.prototype.isPaused = function () {
	return this._audio.paused;
};

Track.prototype.setGain = function (percent) {
	this._gain.gain.value = percent;
};

function Ui() {
//	this._timer =
//		window.requestAnimationFrame       ||
//		window.webkitRequestAnimationFrame ||
//		window.mozRequestAnimationFrame    ||
//		window.oRequestAnimationFrame      ||
//		window.msRequestAnimationFrame     ||
//		function( callback ){
//			window.setTimeout(callback, 1000 / 60);
//		};
}