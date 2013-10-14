require([
  '$api/models'
], function(models) {
  'use strict';
	
	var artistorband;
	var foundWiki = false;
	var split = new Array();
	models.player.load('track').done(function(playing) {
		models.Track.fromURI(playing.track).load('artists').done(function(artist) {
			models.Artist.fromURI(artist.artists).load('name').done(function(artist2) {
				artistorband = artist2.name;
				getWiki();
			});
		});
	});	
	
	models.player.addEventListener('change', function() {
		models.player.load('track', 'playing').done(function(playing) {
			models.Track.fromURI(playing.track).load('artists').done(function(artist) {
				models.Artist.fromURI(artist.artists).load('name').done(function(artist2) {
					artistorband = artist2.name;
					if(playing.playing) {
						$('#article').html("");
						getWiki();
					}
				});
			});
		});		
	
	});
	
	function getWiki() {
		$.getJSON("http://developer.echonest.com/api/v4/artist/search?"+
					"api_key=BQMYVZPSG9FDJTT7N&name=" + artistorband + "&sort=hotttnesss-desc&"+
					"bucket=biographies", function(result) {
					console.log(result);
					if(result.response.artists.length > 0) {
						for(var i=0;i<result.response.artists[0].biographies.length;i++) {
							if(result.response.artists[0].biographies[i].site == "wikipedia") {
								split = result.response.artists[0].biographies[i].text.split("edit");
								$('#article').append("<br /><h3>From " + result.response.artists[0].biographies[i].site + "</h3>");
								for(var i2=0;i2<split.length;i2++) {
									$('#article').append("<br /><p class=block>" + split[i2] + "</p>");	
								}
								foundWiki = true;
							}
						}
						if(foundWiki == false) {
							$('#article').append("<br /><h1>Couldn't find any info for your currently playing artist/band");
						}
					}
					else {
						$('#article').append("<br /><h1>Couldn't find any info for your currently playing artist/band");
					}	
				});
	}			

});
