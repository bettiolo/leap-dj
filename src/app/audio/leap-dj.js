function LeapDj(djConsole) {
	var self = this;
	this._djConsole = djConsole;
//	this._queueX = [];
//	this._queueY = [];
//	this._queueZ = [];

	var pausedFrame = null;
	var latestFrame = null;
	window.onkeypress = function(e) {
		if (e.charCode == 32) {
			if (pausedFrame == null) {
				pausedFrame = latestFrame;
			} else {
				pausedFrame = null;
			}
		}
	};

	var controller = new Leap.Controller({ enableGestures: false });
	controller.loop(function(frame) {
		self.processFrame(frame);
		// self._processPositions();
	});
	controller.on('ready', function() {
		console.log("ready");
	});
	controller.on('connect', function() {
		console.log("connect");
	});
	controller.on('disconnect', function() {
		console.log("disconnect");
	});
	controller.on('focus', function() {
		console.log("focus");
	});
	controller.on('blur', function() {
		console.log("blur");
	});
	controller.on('deviceConnected', function() {
		console.log("deviceConnected");
	});
	controller.on('deviceDisconnected', function() {
		console.log("deviceDisconnected");
	});
}

LeapDj.prototype.processFrame = function (frame) {
	window.HasLeap = true;
	var handCount = 0
	if (frame.hands !== undefined ) {
		handCount = frame.hands.length;
	}
	var pointableCount = frame.pointables.length;

	for (var handId = 0; handId != handCount; handId++) {
		var hand = frame.hands[handId];
		var palmX = (hand.palmPosition[0] * 3);
		var palmY = (hand.palmPosition[2] * 3) - 200;
		var palmZ = (hand.palmPosition[1] * 3) - 400;
		var rotX = (hand._rotation[2] * 90);
		var rotY = (hand._rotation[1] * 90);
		var rotZ = (hand._rotation[0] * 90);
		this._moveHand(hand.id, pointableCount, palmX, palmY, palmZ, rotX, rotY, rotZ);
		break;
	}

	for (var pointableId = 0; pointableId != pointableCount; pointableId++) {
		var pointable = frame.pointables[pointableId];
		var pointableX = (pointable.tipPosition[0] * 3);
		var pointableY = (pointable.tipPosition[2] * 3) - 200;
		var pointableZ = (pointable.tipPosition[1] * 3) - 400;
		var dirX = -(pointable.direction[1] * 90);
		var dirY = -(pointable.direction[2] * 90);
		var dirZ = (pointable.direction[0] * 90);
		this._moveFinger(pointable.id, pointableCount, pointableX, pointableY, pointableZ, dirX, dirY, dirZ);
		break;
	}
	if (pointableCount != 1) {
		if (this._filterWasEnabledByLeap) {
			this._djConsole.setFilterEnabled(false);
			this._filterWasEnabledByLeap = false;
		}

//		this._startX = 0;
//		this._startY = 0;
//		this._startZ = 0;
	}

};

LeapDj.prototype._moveHand = function (handId, pointableCount, x, y, z, rotX, rotY, rotZ) {
	if (pointableCount >= 4) {
		this._processCrossfade(x, y, z);
	}
};

LeapDj.prototype._moveFinger = function (pointableId, pointableCount, x, y, z, dirX, dirY, dirZ) {
//	x = Math.round(x);
//	y = Math.round(y);
//	z = Math.round(z);

//	if (this._startX === 0) {
//		this._startX = x;
//	}
//	if (this._startY === 0) {
//		this._startY = y;
//	}
//	if (this._startZ === 0) {
//		this._startZ = z;
//	}

//	this._queueX.push(posX);
//	this._queueY.push(posY);
//	this._queueZ.push(posZ);
	if (pointableCount == 1) {
		this._processPosition(x, y, z);
	}
};

//LeapDj.prototype._processPositions = function () {
//	var x = Math.round(this._sum(this._queueX) / this._queueX.length) || 0;
//	var y = Math.round(this._sum(this._queueY) / this._queueY.length) || 0;
//	var z = Math.round(this._sum(this._queueZ) / this._queueZ.length) || 0;
//	this._queueX = [];
//	this._queueY = [];
//	this._queueZ = [];
//	this._processPosition(x, y, z);
//};

//LeapDj.prototype._sum = function (arr) {
//	if (!arr.length) {
//		return 0;
//	}
//	return arr.reduce(function(prev, cur) {
//		return prev + cur;
//	});
//};

LeapDj.prototype._processPosition = function (x, y, z) {
	if (!this._filterWasEnabledByLeap) {
		this._filterWasAlreadyEnabled = this._djConsole.getFilterEnabled();
	}
	if (!this._filterWasAlreadyEnabled) {
		this._djConsole.setFilterEnabled(true);
		this._filterWasEnabledByLeap = true;
	}

	this._djConsole.setQuality( (x + 150) / 300 );
	this._djConsole.setFrequency( (z + 150) / 300 );
};

LeapDj.prototype._processCrossfade = function (x, y, z) {
	this._djConsole.setCrossfade( (x + 150) / 300 );
};





