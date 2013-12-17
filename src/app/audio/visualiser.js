function Visualiser(context) {
	this._context = context;
	this._analyser = this._context.createAnalyser();

	this._analyser.minDecibels = -140;
	this._analyser.maxDecibels = 0;

	this.freqs = new Uint8Array(this._analyser.frequencyBinCount);
	this.times = new Uint8Array(this._analyser.frequencyBinCount);
}

Visualiser.prototype.connect = function (audioNode) {
	this._analyser.disconnect();
	this._analyser.connect(audioNode);
};

Visualiser.prototype.getAudioNode = function () {
	return this._analyser;
};

Visualiser.prototype.draw = function(canvas) {
	var WIDTH = parseInt(window.getComputedStyle(canvas, null).width);
	var HEIGHT = 200;// parseInt(window.getComputedStyle(canvas, null).height);
	var SMOOTHING = 0.3;
	var FFT_SIZE = 2048;

	this._analyser.smoothingTimeConstant = SMOOTHING;
	this._analyser.fftSize = FFT_SIZE;

	this._analyser.getByteFrequencyData(this.freqs);
	this._analyser.getByteTimeDomainData(this.times);

	// var width = Math.floor(1 / this.freqs.length);
	var drawContext = canvas.getContext('2d');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	// Draw the frequency domain chart.
	for (var i = 0; i < this._analyser.frequencyBinCount; i++) {
		var value = this.freqs[i];
		var percent = value / 256;
		var height = HEIGHT * percent;
		var offset = HEIGHT - height - 1;
		var barWidth = WIDTH / this._analyser.frequencyBinCount;
		var hue = i / this._analyser.frequencyBinCount * 360;
		drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
		drawContext.fillRect(i * barWidth, offset, barWidth, height);
	}

	// Draw the time domain chart.
	drawContext.moveTo(0, HEIGHT / 2);
	var barWidth = WIDTH / this._analyser.frequencyBinCount;
	for (var i = 0; i < this._analyser.frequencyBinCount; i++) {
		var value = this.times[i];
		var percent = value / 256;
		var height = HEIGHT * percent;
		var ypos = HEIGHT - height - 1;
		var xpos = i * barWidth;
		drawContext.lineTo(xpos, ypos);
	}
	drawContext.stroke();

};