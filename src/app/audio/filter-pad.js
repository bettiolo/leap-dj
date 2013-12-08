function FilterPad(djConsole, canvas) {
	this._djConsole = djConsole;
	this._touches = [];
	this._canvas = canvas;
	this._canvas.width = parseInt(window.getComputedStyle(canvas, null).width);
	this._canvas.height = parseInt(window.getComputedStyle(canvas, null).width);
	this._context = this._canvas.getContext('2d');
	this._setupCanvas();
}

FilterPad.prototype._setupCanvas = function () {
	var self = this;
	this._context.strokeStyle = "#ffffff";
	this._context.lineWidth = 2;
	this._canvas.addEventListener('pointerdown', function (e) { self._onPointerDown(e); }, false );
	this._canvas.addEventListener('pointermove', function (e) { self._onPointerMove(e); }, false );
	this._canvas.addEventListener('pointerup', function (e) { self._onPointerUp(e); }, false );
	this._canvas.addEventListener('pointerleave', function (e) { self._onPointerUp(e); }, false );
};

FilterPad.prototype.draw = function () {
	this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
	for (var j = 0; j < 4; j++) {
		for (var i = 0; i < 4; i++) {
			this._context.fillStyle = "hsl(" + Math.round((360 * (j * 4 + i)) / 16) + ", 100%, 50%)";
			this._context.fillRect(this._canvas.width * i / 4, this._canvas.height * j / 4,
								   this._canvas.width / 4, this._canvas.height / 4);
		}
	}
	for(var i = 0; i < this._touches.length; i++)
	{
		var touch = this._touches[i];
		var x = touch.x;
		var y = touch.y;
		this._context.beginPath();
		this._context.fillStyle = "black";
		this._context.fillText( " id: " + touch.pointerId + " x: " + Math.round(x) + " y: " + Math.round(y), x + 20, y - 10);

		this._context.beginPath();
		this._context.strokeStyle = "black";
		this._context.lineWidth = "6";
		this._context.arc(x, y, 20, 0, Math.PI * 2, true);
		this._context.stroke();
	}
};

FilterPad.prototype._onPointerDown = function (e) {
	e.preventDefault();

	var rect = this._canvas.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;

	var fractionX =  x / e.toElement.clientWidth;
	var fractionY = y / e.toElement.clientHeight;

	for (var i = 0; i < this._touches.length; i++) {
		if (this._touches[i].pointerId == e.pointerId) {
			this._touches.splice(i, 1);
		}
	}
	this._touches.push({
		x: x,
		y: y,
		pointerId: e.pointerId
	});
	this._djConsole.setFilterEnabled(true);
}

FilterPad.prototype._onPointerMove = function (e) {
	e.preventDefault();

	var rect = this._canvas.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;

	var fractionX =  x / e.toElement.clientWidth;
	var fractionY = y / e.toElement.clientHeight;

	for (var i = 0; i < this._touches.length; i++) {
		if (this._touches[i].pointerId == e.pointerId) {
			this._touches[i].x = x;
			this._touches[i].y = y;
			this._filter(Math.abs(1 - fractionY), fractionX);
			return;
		}
	}
};

FilterPad.prototype._onPointerUp = function (e) {
	e.preventDefault();

	var rect = this._canvas.getBoundingClientRect();
	var x = e.clientX - rect.left;
	var y = e.clientY - rect.top;

	var fractionX =  x / e.toElement.clientWidth;
	var fractionY = y / e.toElement.clientHeight;

	for (var i = 0; i < this._touches.length; i++) {
		if (this._touches[i].pointerId == e.pointerId) {
			this._touches.splice(i, 1);
		}
	}
	this._djConsole.setFilterEnabled(false);
}

FilterPad.prototype._filter = function (frequency, quality) {
	this._djConsole.setFrequency(frequency);
	this._djConsole.setQuality(quality);
};