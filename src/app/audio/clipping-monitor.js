function ClippingMonitor(context) {
	var self = this;
	this._context = context;
	this._clippingMeter = this._context.createScriptProcessor(2048, 1, 1);
	this._clippingMeter.onaudioprocess = function(e) { self._processAudio(e); };
}

ClippingMonitor.prototype.connect = function (audioNode) {
	this._clippingMeter.connect(audioNode);
};

ClippingMonitor.prototype.getAudioNode = function () {
	return this._clippingMeter;
}

ClippingMonitor.prototype._processAudio = function(e) {
	var leftBuffer = e.inputBuffer.getChannelData(0);
	this._checkClipping(leftBuffer);
//	var rightBuffer = e.inputBuffer.getChannelData(1);
//	this._checkClipping(rightBuffer);
};

ClippingMonitor.prototype._checkClipping = function(buffer) {
	var isClipping = false;
	for (var i = 0; i < buffer.length; i++) {
		var absValue = Math.abs(buffer[i]);
		if (absValue >= 1) {
			isClipping = true;
			break;
		}
	}
	this._isClipping = isClipping;
};

ClippingMonitor.prototype.isClipping = function () {
	return this._isClipping;
};

