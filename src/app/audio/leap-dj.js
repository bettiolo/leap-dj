function LeapDj(djConsole) {
	var self = this;
	this._djConsole = djConsole;
	this._queueX = [];
	this._queueY = [];
	this._queueZ = [];

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
			// document.getElementById('out').innerHTML = frame.dump();
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
	if (frame.hands === undefined ) {
		var handsLength = 0
	} else {
		var handsLength = frame.hands.length;
	}

	for (var handId = 0, handCount = handsLength; handId != handCount; handId++) {
		var hand = frame.hands[handId];
		var posX = (hand.palmPosition[0] * 3);
		var posY = (hand.palmPosition[2] * 3) - 200;
		var posZ = (hand.palmPosition[1] * 3) - 400;
		var rotX = (hand._rotation[2] * 90);
		var rotY = (hand._rotation[1] * 90);
		var rotZ = (hand._rotation[0] * 90);
		this._moveHand(hand.id, posX, posY, posZ, rotX, rotY, rotZ);
		break;
	}

	for (var pointableId = 0, pointableCount = frame.pointables.length; pointableId != pointableCount; pointableId++) {
		var pointable = frame.pointables[pointableId];
		var posX = (pointable.tipPosition[0] * 3);
		var posY = (pointable.tipPosition[2] * 3) - 200;
		var posZ = (pointable.tipPosition[1] * 3) - 400;
		var dirX = -(pointable.direction[1] * 90);
		var dirY = -(pointable.direction[2] * 90);
		var dirZ = (pointable.direction[0] * 90);
		this._moveFinger(pointable.id, pointableCount, posX, posY, posZ, dirX, dirY, dirZ);
		break;
	}
	if (pointableCount != 1) {
		this._djConsole.setFilterEnabled(false);
		this._startX = 0;
		this._startY = 0;
		this._startZ = 0;
	}

};

LeapDj.prototype._moveHand = function (handId, posX, posY, posZ, rotX, rotY, rotZ) {
};

LeapDj.prototype._moveFinger = function (fingerId, fingerCount, x, y, z, dirX, dirY, dirZ) {
	x = Math.round(x);
	y = Math.round(y);
	z = Math.round(z);

	if (this._startX === 0) {
		this._startX = x;
	}
	if (this._startY === 0) {
		this._startY = y;
	}
	if (this._startZ === 0) {
		this._startZ = z;
	}

	document.getElementById('info').innerHTML =
		'POS: x:' + x + ', y:' + y + ' z:' + z + '<br />' +
			'START: x:' + this._startX  + ', y:' + this._startY + ' z:' + this._startZ;


//	this._queueX.push(posX);
//	this._queueY.push(posY);
//	this._queueZ.push(posZ);
	if (fingerCount == 1) {
		this._processPosition(x, y, z);
	}

	if (fingerCount >= 4) {
		this._processCrossfade(x, y, z);
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
	this._djConsole.setFilterEnabled(true);
	this._djConsole.setQuality( (x + 150) / 300 );
	this._djConsole.setFrequency( (z + 150) / 300 );
};

LeapDj.prototype._processCrossfade = function (x, y, z) {
	this._djConsole.setCrossfade( (x + 150) / 300 );
};





