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
	var ui = new Ui(djConsole);

	djConsole.leftTrack.setSrc('music/track5.mp3');
	djConsole.rightTrack.setSrc('music/track4.mp3');
	djConsole.leftTrack.play();
}

function DjConsole() {
	this._context = new webkitAudioContext();
	this._gain = this._context.createGainNode();
	this._gain.connect(this._context.destination);
	this._biquadFilter = this._context.createBiquadFilter();
	this._biquadFilter.connect(this._gain);

	this.leftTrack = new Track(this._context);
	this.leftTrack.connect(this._biquadFilter);

	this.rightTrack = new Track(this._context);
	this.rightTrack.connect(this._biquadFilter);
}

DjConsole.prototype.setQualityFactor = function (fraction) {
	fraction = Math.min(1.0, Math.max(0.0, fraction));
	var value = 40 * fraction;
	console.log('quality: ' + fraction + '=' + value);
	this._biquadFilter.Q.value = value;
};

DjConsole.prototype.setFrequencyFactor = function (fraction) {
	var value = Math.pow(2, 13 * fraction);
	console.log('frequency: ' + fraction + '=' + value);
	this._biquadFilter.frequency.value = value;
};

DjConsole.prototype.setCrossfade = function (fraction) {
	var gain1 = Math.cos(fraction * 0.5 * Math.PI);
	var gain2 = Math.cos((1.0 - fraction) * 0.5 * Math.PI);
	this.leftTrack.setGain(gain1);
	this.rightTrack.setGain(gain2);
};

DjConsole.prototype.setMasterVolume = function (fraction) {
	this._gainFraction = fraction;
	var value = fraction * fraction;
	this._gain.gain.value = value;
};

DjConsole.prototype.getMasterVolume = function () {
	return this._gainFraction;
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

Track.prototype.setGain = function (fraction) {
	this._gain.gain.value = fraction;
};

function Ui(djConsole) {
	this._djConsole = djConsole;
	this._bind();
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

Ui.prototype._bind = function () {
	var self = this;
	document.getElementById("pause-left").addEventListener('click', function() {
		self._djConsole.leftTrack.toggle();
	});

	document.getElementById("pause-right").addEventListener('click', function() {
		self._djConsole.rightTrack.toggle();
	});

	document.getElementById("quality-range").addEventListener('change', function(event) {
		self._djConsole.setQualityFactor(event.target.value / 100);
	});

	document.getElementById("frequency-range").addEventListener('change', function(event) {
		self._djConsole.setFrequencyFactor(event.target.value / 100);
	});

	document.getElementById("crossfade-range").addEventListener('change', function(event) {
		self._djConsole.setCrossfade(event.target.value / 100);
	});

	document.getElementById("master-volume-range").addEventListener('change', function(event) {
		self._djConsole.setMasterVolume(event.target.value / 100);
	});
};

Ui.prototype._update = function () {

};