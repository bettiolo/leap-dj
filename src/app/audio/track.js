function Track(context, endedCallback) {
	this._context = context;
	this._audio = new Audio();
	this._audio.addEventListener('ended', function () {
		endedCallback();
	});
	this._source = this._context.createMediaElementSource(this._audio);
	this._gain = this._context.createGainNode();
	this.visualiser = new Visualiser(this._context);
	// this._source.connect(this.visualiser.getAudioNode());
	this._source.connect(this._gain);
	this._gain.connect(this.visualiser.getAudioNode());
}

Track.prototype.connect = function (audioNode) {
	//	this._gain.disconnect();
	//	this._gain.connect(audioNode);
	// this.visualiser.disconnect();
	this.visualiser.connect(audioNode);
};

Track.prototype.set = function (trackInfo) {
	this._trackInfo = trackInfo;
	this.setSrc(trackInfo.url);
}

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
	if (this.isPlaying()) {
		this.pause();
	} else {
		this.play();
	}
};

Track.prototype.isPlaying = function () {
	return !(this._audio.paused || this._audio.ended);
};

Track.prototype.setGain = function (fraction) {
	this._gain.gain.value = fraction;
};

Track.prototype.getTrackInfo = function () {
	return this._trackInfo || {};
};

Track.prototype.getDuration = function () {
	return this._audio.duration;
};

Track.prototype.getElapsed = function () {
	return this._audio.currentTime;
};

Track.prototype.getRemaining = function () {
	return this.getDuration() - this.getElapsed();
};