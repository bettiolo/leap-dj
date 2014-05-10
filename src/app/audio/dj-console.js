function DjConsole() {
	var self = this;
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	try {
		this._context = new AudioContext();
	}
	catch(e) {
		alert('Web Audio API is not supported in this browser');
	}
	this.clippingMonitor = new ClippingMonitor(this._context);
	this.clippingMonitor.connect(this._context.destination);
	this._gain = this._context.createGain();
	this._gain.connect(this.clippingMonitor.getAudioNode());
	this._gain.connect(this._context.destination);

	this._biquadFilter = this._context.createBiquadFilter();
	this.leftPlayer = new Player(this._context, function () {
		self.playRandomTrack(self.leftPlayer);
	});
	this.rightPlayer = new Player(this._context, function () {
		self.playRandomTrack(self.rightPlayer);
	});

	this.setMasterVolume(1); // default volume 100%
	this.setCrossfade(0); // default crossfade 100% left
	this.setFilterEnabled(false);
	this.setFilterType(this._biquadFilter.LOWPASS);
	this.setFrequency(0.6);
	this.setQuality(0.75);
}

DjConsole.prototype.setFilterEnabled = function (enabled) {
	if (this._filterEnabled === enabled) {
		return;
	}
	this._filterEnabled = enabled;
	this._biquadFilter.disconnect();
	if (enabled) {
		this._biquadFilter.connect(this._gain);
		this.leftPlayer.connect(this._biquadFilter);
		this.rightPlayer.connect(this._biquadFilter);
	} else {
		this.leftPlayer.connect(this._gain);
		this.rightPlayer.connect(this._gain);
	}
};

DjConsole.prototype.getFilterEnabled = function () {
	return this._filterEnabled;
};

DjConsole.prototype._getValidFraction = function (fraction, max) {
	max = max || 1.0;
	if (fraction < 0) {
		fraction = 0.0;
	}
	if (fraction > max) {
		fraction = max;
	}
	return fraction;
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
	this.leftPlayer.setGain(gain1);
	this.rightPlayer.setGain(gain2);
};

DjConsole.prototype.getCrossfade = function () {
	return this._crossfadeFraction;
};

DjConsole.prototype.setMasterVolume = function (fraction) {
	fraction = this._getValidFraction(fraction, 2.0);
	this._masterGainFraction = fraction;
	this._gain.gain.value = fraction * fraction;
};

DjConsole.prototype.getMasterVolume = function () {
	return this._masterGainFraction;
};

DjConsole.prototype.setTracks = function (tracks) {
	this._tracks = tracks;
};

DjConsole.prototype.isLoaded = function () {
	return this._tracks && this._tracks.length;
};

DjConsole.prototype.playRandomTrack = function (track) {
	var randomTrack = Math.floor((Math.random() * this._tracks.length) + 1);
	track.set(this._tracks[randomTrack]);
	track.play();
}