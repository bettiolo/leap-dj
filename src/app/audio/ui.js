function Ui(djConsole) {
	this._masterVolumeRange = document.getElementById('master-volume-range');
	this._crossfadeRange = document.getElementById('crossfade-range');
	this._qualityRange = document.getElementById('quality-range');
	this._frequencyRange = document.getElementById('frequency-range');
	this._filterTypeSelect = document.getElementById('filter-type');
	this._filterEnabledCheckBox = document.getElementById('filter-enabled');
	this._clippingInfo = document.getElementById('clipping-info');
	this._leftTrackVisualisation = document.getElementById('left-track-visualisation');
	this._rightTrackVisualisation = document.getElementById('right-track-visualisation');

	this._djConsole = djConsole;
	this._filterPad = new FilterPad(djConsole, document.getElementById('filter-pad'));
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
	this._djConsole.leftTrack.visualiser.draw(this._leftTrackVisualisation);
	this._djConsole.rightTrack.visualiser.draw(this._rightTrackVisualisation);
	this._setPercentValue(this._masterVolumeRange, this._djConsole.getMasterVolume());
	this._setPercentValue(this._crossfadeRange, this._djConsole.getCrossfade());
	this._setPercentValue(this._qualityRange, this._djConsole.getQuality());
	this._setPercentValue(this._frequencyRange, this._djConsole.getFrequency());
	this._setValue(this._filterTypeSelect, this._djConsole.getFilterType());
	this._setCheckBox(this._filterEnabledCheckBox, this._djConsole.getFilterEnabled());
	if (this._djConsole.clippingMonitor.isClipping()) {
		this._clippingInfo.className = 'clipping';
	} else {
		this._clippingInfo.className = 'not-clipping';
	}
	this._filterPad.draw();
};

Ui.prototype._setPercentValue = function (element, fraction) {
	this._setValue(element, fraction * 100);
};

Ui.prototype._setValue = function (element, value) {
	var oldValue = Math.round(element.value);
	value = Math.round(value);
	if (oldValue != value) {
		console.log('Updated: ' + element.id + ' from ' + element.value + '% to ' + value + '%');
		element.value = value;
	}
};

Ui.prototype._setCheckBox = function (element, checked) {
	if (element.checked != checked) {
		console.log('Updated: ' + element.id + ' from ' + element.checked + ' to ' + checked);
		element.checked = checked;
	}
};