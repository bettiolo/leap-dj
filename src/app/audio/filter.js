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

	djConsole.leftTrack.setSrc('music/track4.mp3');
	djConsole.rightTrack.setSrc('music/track5.mp3');
	djConsole.leftTrack.play();
	djConsole.rightTrack.play();
}

function DjConsole() {
	this._context = new webkitAudioContext();
	this._gain = this._context.createGainNode();
	this._gain.connect(this._context.destination);
	this._biquadFilter = this._context.createBiquadFilter();
	this.leftTrack = new Track(this._context);
	this.rightTrack = new Track(this._context);

	this.setMasterVolume(1); // default volume 100%
	this.setCrossfade(0); // default crossfade 100% left
	this.setFilterEnabled(false);
	this.setFilterType(this._biquadFilter.LOWPASS);
	this.setFrequency(0.6);
	this.setQuality(0.75);
}

DjConsole.prototype.setFilterEnabled = function (enabled) {
	this._filterEnabled = enabled;
	this._biquadFilter.disconnect();
	if (enabled) {
		this._biquadFilter.connect(this._gain);
		this.leftTrack.connect(this._biquadFilter);
		this.rightTrack.connect(this._biquadFilter);
	} else {
		this.leftTrack.connect(this._gain);
		this.rightTrack.connect(this._gain);
	}
};

DjConsole.prototype.getFilterEnabled = function () {
	return this._filterEnabled;
};

DjConsole.prototype._getValidFraction = function (fraction) {
	return Math.min(1.0, Math.max(0.0, fraction));
};

DjConsole.prototype.setQuality = function (fraction) {
	this._qualityFraction = this._getValidFraction(fraction);
	this._biquadFilter.Q.value = 30 * this._qualityFraction;
};

DjConsole.prototype.getQuality = function () {
	return this._qualityFraction;
};

DjConsole.prototype.setFrequency = function (fraction) {
	this._frequencyFraction = this._getValidFraction(fraction);
	var minValue = 40;
	var maxValue = this._context.sampleRate / 2;
	var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
	var value = Math.pow(2, numberOfOctaves * (this._frequencyFraction - 1.0));
	this._biquadFilter.frequency.value = maxValue * value;
};

DjConsole.prototype.getFrequency = function () {
	return this._frequencyFraction;
}

DjConsole.prototype.setFilterType = function (type) {
	this._filterType = type;
	this._biquadFilter.type = this._filterType;
};

DjConsole.prototype.getFilterType = function () {
	return this._filterType;
};

DjConsole.prototype.setCrossfade = function (fraction) {
	fraction = this._getValidFraction(fraction);
	this._crossfadeFraction = fraction;
	var gain1 = Math.cos(fraction * 0.5 * Math.PI);
	var gain2 = Math.cos((1.0 - fraction) * 0.5 * Math.PI);
	this.leftTrack.setGain(gain1);
	this.rightTrack.setGain(gain2);
};

DjConsole.prototype.getCrossfade = function () {
	return this._crossfadeFraction;
};

DjConsole.prototype.setMasterVolume = function (fraction) {
	fraction = this._getValidFraction(fraction);
	this._masterGainFraction = fraction;
	var value = fraction * fraction;
	this._gain.gain.value = value;
};

DjConsole.prototype.getMasterVolume = function () {
	return this._masterGainFraction;
};

function Track(context) {
	this._audio = new Audio();
	this._source = context.createMediaElementSource(this._audio);
	this._gain = context.createGainNode();
	this._source.connect(this._gain);
}

Track.prototype.connect = function (audioNode) {
	this._gain.disconnect();
	this._gain.connect(audioNode);
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
	this._masterVolumeRange = document.getElementById('master-volume-range');
	this._crossfadeRange = document.getElementById('crossfade-range');
	this._qualityRange = document.getElementById('quality-range');
	this._frequencyRange = document.getElementById('frequency-range');
	this._filterTypeSelect = document.getElementById('filter-type');
	this._filterEnabledCheckBox = document.getElementById('filter-enabled');

	this._djConsole = djConsole;
	this._bind();
	this._uiUpdater =
		window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function (callback){
			window.setTimeout(callback, 1000 / 60);
		};
	var self = this;
	// this._uiUpdater(function () { self._update(); });
	window.setInterval(function () { self._update() }, 1000 / 60);
}

Ui.prototype._bind = function () {
	var self = this;
	document.getElementById("pause-left").addEventListener('click', function() {
		self._djConsole.leftTrack.toggle();
	});

	document.getElementById("pause-right").addEventListener('click', function() {
		self._djConsole.rightTrack.toggle();
	});

	this._qualityRange.addEventListener('change', function(event) {
		self._djConsole.setQuality(event.target.value / 100);
	});

	this._frequencyRange.addEventListener('change', function(event) {
		self._djConsole.setFrequency(event.target.value / 100);
	});

	this._crossfadeRange.addEventListener('change', function(event) {
		self._djConsole.setCrossfade(event.target.value / 100);
	});

	this._masterVolumeRange.addEventListener('change', function(event) {
		self._djConsole.setMasterVolume(event.target.value / 100);
	});

	this._filterTypeSelect.addEventListener('change', function(event) {
		self._djConsole.setFilterType(parseInt(event.target.value));
	});

	this._filterEnabledCheckBox.addEventListener('change', function(event) {
		self._djConsole.setFilterEnabled(event.target.checked);
	});
};

Ui.prototype._update = function () {
	if (!this._djConsole) {
		return;
	}
	this._setPercentValue(this._masterVolumeRange, this._djConsole.getMasterVolume());
	this._setPercentValue(this._crossfadeRange, this._djConsole.getCrossfade());
	this._setPercentValue(this._qualityRange, this._djConsole.getQuality());
	this._setPercentValue(this._frequencyRange, this._djConsole.getFrequency());
	this._setValue(this._filterTypeSelect, this._djConsole.getFilterType());
	this._setCheckBox(this._filterEnabledCheckBox, this._djConsole.getFilterEnabled());
};

Ui.prototype._setPercentValue = function (element, fraction) {
	this._setValue(element, fraction * 100);
};

Ui.prototype._setValue = function (element, value) {
	var oldValue = Math.round(element.value);
	value = Math.round(value);
	if (oldValue != value) {
		console.log('Updated: ' + element.id + ' from ' + element.value + ' to ' + value + '%');
		element.value = value;
	}
};

Ui.prototype._setCheckBox = function (element, checked) {
	if (element.checked != checked) {
		console.log('Updated: ' + element.id + ' from ' + element.checked + ' to ' + checked);
		element.checked = checked;
	}
};