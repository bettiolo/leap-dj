function SoundCloud() {
	this.clientId = 'b07647ddc8d151245fe17e491af8299d';
	SC.initialize({
		client_id: this.clientId,
		redirect_uri: ''
	});
}

SoundCloud.prototype.loadTracks = function (tracksLoadedCallBack) {
	var self = this;
	SC.get('/playlists/9165886/tracks', {}, function(soundCloudTracks, error){
		if (!!error) {
			alert('Error loading connecting to SoundCloud: ' + error.message);
		}
		var trackCount = soundCloudTracks.length;
		self.tracks = [];
		for (var i = 0; i < trackCount; i++) {
			var soundCloudTrack = soundCloudTracks[i];
			if (soundCloudTrack.streamable) {
				self.tracks.push(self.convertTrack(soundCloudTrack));
			}
		}
		tracksLoadedCallBack();
	});
}

SoundCloud.prototype.convertTrack = function (soundCloudTrack) {
	var trackInfo = new TrackInfo();
	trackInfo.url = soundCloudTrack.stream_url + '?client_id=' + this.clientId;
	trackInfo.title = soundCloudTrack.title;
	trackInfo.durationMs = soundCloudTrack.duration;
	return trackInfo;
}
