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
	this._leftTrackTitle = document.getElementById('left-track-title');
	this._rightTrackTitle = document.getElementById('right-track-title');
	this._leftTrackInfo = document.getElementById('left-track-info');
	this._rightTrackInfo = document.getElementById('right-track-info');
	this._mainSection = document.getElementById('main-section');
	this._loadingSection = document.getElementById('loading-section');

	this._djConsole = djConsole;
	this._filterPad = new FilterPad(djConsole, document.getElementById('filter-pad'));
	this._bind();
	var self = this;
	window.requestAnimationFrame(function () { self._update(); });
}

Ui.prototype._bind = function () {
	var self = this;
	document.getElementById("pause-left").addEventListener('click', function() {
		self._djConsole.leftPlayer.toggle();
	});

	document.getElementById("pause-right").addEventListener('click', function() {
		self._djConsole.rightPlayer.toggle();
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
	if (window.HasLeap) {
		this._setPercentValue(this._masterVolumeRange, this._djConsole.getMasterVolume());
		this._setPercentValue(this._crossfadeRange, this._djConsole.getCrossfade());
		this._setPercentValue(this._qualityRange, this._djConsole.getQuality());
		this._setPercentValue(this._frequencyRange, this._djConsole.getFrequency());
	}
	this._setValue(this._filterTypeSelect, this._djConsole.getFilterType());
	this._setCheckBox(this._filterEnabledCheckBox, this._djConsole.getFilterEnabled());
	this._setText(this._leftTrackTitle, this._djConsole.leftPlayer.getTrackInfo().title || 'n/a');
	this._setText(this._rightTrackTitle, this._djConsole.rightPlayer.getTrackInfo().title || 'n/a');
	this._setTime(this._leftTrackInfo, this._djConsole.leftPlayer.getRemaining());
	this._setTime(this._rightTrackInfo, this._djConsole.rightPlayer.getRemaining());
	this._toggleCss(this._clippingInfo, this._djConsole.clippingMonitor.isClipping(), 'clipping', 'not-clipping');
	this._toggleCss(this._mainSection, !this._djConsole.isLoaded(), 'hidden', '');
	this._toggleCss(this._loadingSection, this._djConsole.isLoaded(), 'hidden', '');

	this._djConsole.leftPlayer.visualiser.draw(this._leftTrackVisualisation);
	this._djConsole.rightPlayer.visualiser.draw(this._rightTrackVisualisation);
	this._filterPad.draw();

	var self = this;
	window.requestAnimationFrame(function () { self._update(); });
};

Ui.prototype._setPercentValue = function (element, fraction) {
	this._setValue(element, fraction * 100);
};

Ui.prototype._setValue = function (element, value) {
	var oldValue = Math.round(element.value);
	value = Math.round(value);
	if (oldValue != value) {
		element.value = value;
	}
};

Ui.prototype._setCheckBox = function (element, checked) {
	if (element.checked != checked) {
		element.checked = checked;
	}
};

Ui.prototype._setText = function (element, text) {
	if (element.innerText != text) {
		element.innerText = text;
	}
};

Ui.prototype._setTime = function (element, seconds) {
	var text = '0s';
	if (!!seconds) {
		var minutes = Math.floor(seconds / 60);
		var secondsPart = seconds - (minutes * 60);
		secondsPart = Math.ceil(secondsPart);
		text = '-' + minutes + ':' + this._pad(secondsPart, 2) + 's';
	}
	if (element.innerText != text) {
		element.innerText = text;
	}
};

Ui.prototype._toggleCss = function (element, toggle, trueClass, falseClass) {
	if (toggle) {
		element.className = trueClass;
	} else {
		element.className = falseClass;
	}
}

Ui.prototype._pad = function (num, size) {
	var s = "000000000" + num;
	return s.substr(s.length-size);
};