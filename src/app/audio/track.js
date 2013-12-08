function Track(context) {
	this._context = context;
	this._audio = new Audio();
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
