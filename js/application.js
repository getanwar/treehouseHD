$(document).ready(function() {
	"use strict";

var errorMsg = $('.result').find('.error_msg');
var successMsg = $('.result').find('.success_msg');

function download(filename, text) {
	var el = successMsg.find('a');
	el.attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	el.attr('download', filename);
	el.html(filename);
}

$('#treehouse-download').find('input[name="url"]').on('focus', function() {
	$(this).select();
});

/******************** LEFT NAVBAR ********************/
$('#treehouse-download').on('submit', function(e) {
	e.preventDefault();

	var el = $(this);

	errorMsg.fadeOut();

	// get link and token
	var link = el.find('input[name="url"]');
	var token = el.find('input[name="token"]');

	if( link.val() !== '' && link.val().indexOf('teamtreehouse') > -1 && token.val() !== '' && token.val().length > 10 ) {

		if ( token.val().indexOf('itpc') > -1 ) {

			var fetchToken = token.val().replace(/^.+token=(.+)/g, '$1');

			token.val(fetchToken);
		}

		var linkHD = link.val().replace(/https?(:\/\/teamtreehouse.+)/g, 'itpc$1.rss?feed_token=' + token.val() + '&hd=true');

		var FEED_URL = linkHD.replace('itpc', 'https');

		$.get(FEED_URL, function (data) {
			var namesArr = [];
			var filename = $(data).find('title').eq(0).text();
				 filename += ".txt";

			$(data).find("item").each(function ( i ) { // or "item" or whatever suits your feed
				var el = $(this);
				var serial = i + 1;
				var text = serial;
					 text += '. ';
					 text += el.find("title").text();

				namesArr.push(text);
			});

			var names = namesArr.join("\r\n\r\n");
			download(filename, names);

			errorMsg.fadeOut();
			successMsg.fadeIn();
		});

		window.location.href = linkHD;

	} else {
		errorMsg.html('Please provide valid treehouse link and token.');
		errorMsg.fadeIn();
	}

});


});