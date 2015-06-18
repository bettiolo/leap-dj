function Player(context, endedCallback) {
	this._context = context;
	this._audio = new Audio();
	this._audio.crossOrigin = "anonymous";
	this._audio.addEventListener('ended', function () {
		endedCallback();
	});
	this._source = this._context.createMediaElementSource(this._audio);
	this._gain = this._context.createGain();
	this.visualiser = new Visualiser(this._context);
	// this._source.connect(this.visualiser.getAudioNode());
	this._source.connect(this._gain);
	this._gain.connect(this.visualiser.getAudioNode());
}

Player.prototype.connect = function (audioNode) {
	//	this._gain.disconnect();
	//	this._gain.connect(audioNode);
	// this.visualiser.disconnect();
	this.visualiser.connect(audioNode);
};

Player.prototype.set = function (trackInfo) {
	console.log(trackInfo);
	this._trackInfo = trackInfo;
	this.setSrc(trackInfo.url);
};

Player.prototype.setSrc = function (src) {
	this._audio.src = src;
};

Player.prototype.play = function () {
	this._audio.play();
};

Player.prototype.pause = function () {
	this._audio.pause();
};

Player.prototype.toggle = function () {
	if (this.isPlaying()) {
		this.pause();
	} else {
		this.play();
	}
};

Player.prototype.isPlaying = function () {
	return !(this._audio.paused || this._audio.ended);
};

Player.prototype.setGain = function (fraction) {
	this._gain.gain.value = fraction;
};

Player.prototype.getTrackInfo = function () {
	return this._trackInfo || {};
};

Player.prototype.getDuration = function () {
	return this._audio.duration;
};

Player.prototype.getElapsed = function () {
	return this._audio.currentTime;
};

Player.prototype.getRemaining = function () {
	return this.getDuration() - this.getElapsed();
};