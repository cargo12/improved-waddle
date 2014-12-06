var first = true;
var currentID;
var currentState;
var gpfirst = true;
var done = false;
var startfrom = 51;
var tempPlayerState;

// YouTube Api
var tag = document.createElement('script');
tag.src = "http://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

(function ($) {
    $.fn.shuffle = function () {
	var allElems = this.get(),
	    getRandom = function (max) {
		return Math.floor(Math.random() * max);
	    },
	    shuffled = $.map(allElems, function () {
		var random = getRandom(allElems.length),
		    randEl = $(allElems[random]).clone(true)[0];
		allElems.splice(random, 1);
		return randEl;
	    });

	this.each(function (i) {
	    $(this).replaceWith($(shuffled[i]));
	});

	return $(shuffled);
    };
})(jQuery);

// On Document Load
$(function () {
    if (loadplaylist != "") {
	$('#controls').hide();
	$('#main').fadeIn();
	$('#intro').html('<h1>Loading playlist…</h1><br /><img src="load.gif" />');
	setTimeout("getplaylist(loadplaylist); $('#controls').fadeIn();", 2000);
    } else {
	loadRedditPlaylist('futurebeats');
    }


    $("#smallogo").tooltip({placement: 'bottom'});

    var subreddits = [
	'futuregarage',
	'futurebeats',
	'futurefunkairlines',
	'dubstep',
	'realdubstep',
	'electronicmusic',
	'idm',
	'music',
	'purplemusic',
	'housemusic',
	'listentothis',
	'metal',
	'indierock',
	'jazz',
	'hiphopheads',
	'chillmusic',
	'classicalmusic',
	'trance',
	'dnb',
	'mashups'
    ];

    $(subreddits).each(function (index) {
	$("#dropdownMenu").append('<li><a href="#" class="btnReddit" data-playlist="' + subreddits[index] + '">/r/' + subreddits[index] + '</a></li>');

    });

    $( "#playlistcontent" ).sortable({
	placeholder: "ui-state-highlight"
    });
    $( "#playlistcontent" ).disableSelection();

    $("#dropdownMenu").on("click", ".btnReddit", function (e) {
	loadRedditPlaylist($(this).attr('data-playlist'));
    });


    $('#recent').on("click", "a", function (event) {
	$('#txtSearch').attr("value", $(this).attr('data-href'));
	$('#btnSearch').click();
    });

    $("#grid").on("click", ".loadmore", function (event) {
	$('.loadmoreimg').attr('src', '/assets/images/load.gif');
	scrolltothis = $('.loadmore').prev();
	loadwhat = $('.loadmore').find('a').attr('href');
	geturl = loadwhat + '&from=' + startfrom;

	$.ajax({
	    url: geturl,
	    success: function (data) {
		$('.loadmore').detach();
		$('#grid').append(data);
		$('#grid').scrollTo(scrolltothis, {duration: 700});
	    }
	});

	startfrom = startfrom + 50;
	return false;
    });

    $(document).on("click", ".video", function (event) {
	var video_id = $(this).children("a").attr("href").match(/v=(.{11})/)[1];
	var video_title = $(this).children("a").text();
	$(this).children(".playoverlay").fadeOut('fast').fadeIn('fast');
	addtoplaylist(video_id, video_title);
	return false;
    });

    $(document).on("click", ".playlistitem", function (event) {
	playid($(this).attr("data-id"), $(this).text());
	//console.log($(this).attr("data-id"));
	$("#playlistcontent li").removeClass('active');
	$(this).parent().addClass('active');
    });

    $(document).on("click", ".playlistremove", function (event) {
	$(this).parent().remove();
    });

    $('#grid').on("mouseenter", ".video",
	function (event) {
	    $(this).children('.related').fadeIn(100);
	    $(this).children('.playoverlay').fadeIn(100);
	});
    $('#grid').on("mouseleave", ".video",
	function (event) {
	    $(this).children('.related').hide();
	    $(this).children('.playoverlay').hide();
	});

    $('#playlistcontent').on("mouseenter", "li", function (e) {
	$(this).children('.playlistremove').css('display', 'block');
    });
    $('#playlistcontent').on("mouseleave", "li", function (e) {
	$(this).children('.playlistremove').css('display', 'none');
    });

    $('#grid').on("click", ".related",
	function () {
	    $(this).children("a").html('<img src="/assets/images/miniloader.gif" />');
	    geturl = $(this).children("a").attr("data-href");

	    $.ajax({
		url: geturl,
		success: function (data) {
		    $('#grid').html(data);
		    $('#grid').scrollTo($('#grid').children().first(), {duration: 500});
		}
	    });


	    return false;
	});

    $("#playlistcode").click(function () {
	$(this).select();
    });

    $("#btnSearch").click(function () {
	if ($('#txtSearch').val() == '') {
	    $('#txtSearch').attr('placeholder', 'Enter song or artist…');
	    $('#txtSearch').focus();
	} else {
	    $("#txtSearch").addClass("loading");

	    geturl = 'yt.php?action=search&q=' + $('#txtSearch').val();

	    $.ajax({
		url: geturl,
		success: function (data) {
		    $('#grid').empty();
		    $('#grid').html(data);
		    $("#txtSearch").removeClass("loading");
		    // $('#grid').scrollTo($('#grid').children().first(), {duration: 500});
		}
	    });

	}
    });

    $("#txtSearch").keypress(function (e) {
	//Enter key
	if (e.which == 13) {
	    $("#btnSearch").click();
	    return false;
	}
    });

    $("#txtSearch").typeahead({
	source: function (request, response) {
	    $.getJSON("http://suggestqueries.google.com/complete/search?callback=?",
		{
		    "hl": "en", // Language
		    "ds": "yt", // Restrict lookup to youtube
		    "jsonp": "suggestCallBack", // jsonp callback function name
		    "q": request, // query term
		    "client": "youtube" // force youtube style response, i.e. jsonp
		}
	    );
	    suggestCallBack = function (data) {
		var suggestions = [];
		$.each(data[1], function (key, val) {
		    suggestions.push(val[0]);
		});
		response(suggestions);
	    };
	},
	minLength: 2,
	items: 10
    });


    $('#txtSearch').click(function () {
	$(this).select();
    });

    $("#btnRelated").click(function () {
	$.ajax({
	    url: 'yt.php?action=related&id=' + currentID,
	    success: function (data) {
		$('#grid').empty();
		$('#grid').html(data);
		$("#txtSearch").removeClass("loading");
	    }
	});
    });

    $('#pauseplay').click(function () {
	if (currentState == 1) {
	    ytPlayer.pauseVideo()
	}
	else {
	    ytPlayer.playVideo();
	}
    });

    $("#previous").click(function () {
	if ($('#playlistcontent li.active').length == 0) {
	    $('#playlistcontent li').first().find("a").click();

	} else {
	    $('#playlist').scrollTo($('#playlistcontent li.active').prev().find("a"), {duration: 100});
	    $('#playlistcontent li.active').prev().find("a").click();
	}
    });

    $("#next").click(function () {
	if ($('#playlistcontent li.active').length == 0) {
	    $('#playlistcontent li').first().find("a").click();

	} else {
	    $('#playlist').scrollTo($('#playlistcontent li.active').next().find("a"), {duration: 100});
	    $('#playlistcontent li.active').next().find("a").click();
	}
    });

    $('#shuffle').click(function () {
	$('#playlist ul li').shuffle();
    });

    $("#btnGenerate").click(function () {
	$("#playlistcode, #smallogo, img[rel=tooltip]").tooltip({placement: 'top'});
	playlistarray = {};

	$(".playlistitem").each(function (index) {
	    playlistarray[$(this).attr('data-id')] = $(this).text();
	});

	playlistJSON = JSON.stringify(playlistarray);

	$.ajax({
	    type: 'POST',
	    url: 'store.php?action=store',
	    data: 'playlistdata=' + escape(playlistJSON),
	    success: function (data) {
		$url = "http://instadj.com/" + data;

		$("#playlistcode").attr("value", $url);

		$("#sbtn001 a").attr("href",
		    "https://facebook.com/sharer/sharer.php?u=http%3A%2F%2Finstadj.com%2F" + data);

		$("#sbtn002 a").attr("href",
		    "https://www.twitter.com/intent/tweet?text="
		    + "Check%20out%20my%20InstaDJ%20playlist."
		    + "&url=http://instadj.com/" + data);

		$("#btnGenEmail").attr("href",
		    "mailto:?subject=Check out my playlist"
		    + "&body=Hi, I made a playlist and thou" +
		    "ght you might like it: " + $url);

	    }

	});


	$(this).attr("disabled", "disabled");
	$("#sharingoptions").removeClass('hidden').fadeIn();
    });


    $('#txtSearch').focus();

});

function onPlayerReady(event) {
    event.target.playVideo();

    ytPlayer.addEventListener("onStateChange", "ytState");
}

function onPlayerStateChange(event) {
    if (event.data == 0) {
	if (($('#playlistcontent li').length == 0) || ($('#playlistcontent li').length == 1)) {
	    // Don't do anything
	} else {
	    if ($('#playlistcontent li.active').length == 0) {
		$('#playlistcontent li').first().find("a").click();

	    } else {
		$('#playlist').scrollTo($('#playlistcontent li.active').next().find("a"), {duration: 500});
		$('#playlistcontent li.active').next().find("a").click();
	    }

	}
    }
    currentState = event.data;

    if (event.data == 1) {
	ytPlayer.setPlaybackQuality('hd720');
    }
}


$(document).on("click", "#btnFavorites", function (event) {
    if ($('#txtSearch').val() == '') {
	$('#txtSearch').attr('placeholder', 'Enter username…');
	$('#txtSearch').focus();
    } else {
	$("#txtSearch").addClass("loading");

	$.ajax({
	    url: 'yt.php?action=userfavorites&user=' + $('#txtSearch').val(),
	    success: function (data) {
		$('#grid').empty();
		$('#grid').html(data);
		$("#txtSearch").removeClass("loading");
		$('#grid').scrollTo($('#grid').children().first(), {duration: 500});
	    }
	});

    }

});

$(document).on("click", "#btnUploads", function (event) {

    if ($('#txtSearch').val() == '') {
	$('#txtSearch').attr('placeholder', 'Enter username…');
	$('#txtSearch').focus();
    } else {
	$("#txtSearch").addClass("loading");

	if (first == true) {
	    $('#player').show();
	    $('#playlist').show();
	    $('#intro').fadeOut('fast');
	}

	$.ajax({
	    url: 'yt.php?action=useruploads&user=' + $('#txtSearch').val(),
	    success: function (data) {
		$('#grid').empty();
		$('#grid').html(data);
		$("#txtSearch").removeClass("loading");
		$('#grid').scrollTo($('#grid').children().first(), {duration: 500});
	    }
	});
    }
});


$('li').click(function (event) {
    event.stopPropagation();
});

function playid(id, title) {
    currentID = id;

    if (first === true) {
	first = false;

	ytPlayer = new YT.Player('player', {
	    height: '390px',
	    width: '250px',
	    playerVars: {
		'autoplay': 1,
		'autohide': 1,
		'theme': 'light',
		'color': 'red',
		'iv_load_policy': '3',
		'showinfo': '0'
	    },
	    videoId: id,
	    events: {
		'onReady': onPlayerReady,
		'onStateChange': onPlayerStateChange
	    }
	});
	$('#playlistcontrols').fadeIn('fast');


    } else {
	if (ytPlayer) {
	    ytPlayer.loadVideoById(id, 0, 'large');
	}

    }
}

/*
 -1 (unstarted)
 0 (ended)
 1 (playing)
 2 (paused)
 3 (buffering)
 5 (video cued).
 */

function addtoplaylist(id, title, noscroll) {
    activehtml = '';
    if (first == true) {
	activehtml = ' class="active"';
    }
    // Play first added item

    try {
	tempPlayerState = ytPlayer.getPlayerState();
    } catch (e) {
	tempPlayerState = 9;
    }

    if (($('#playlistcontent').children().length == 0) || (tempPlayerState == -1) || (tempPlayerState == 0)) {
	playid(id, title);
	$('li.active').removeClass("active");
	activehtml = ' active';
    }
    ;


    $('#btnGenerate').show().removeAttr('disabled');

    $('#playlistcontent').append(
	$('<li class="' + activehtml + '">' +
	'	<a class="playlistitem" href="#" data-id="' + id + '">' +
	'	<img width="40" height="30" class="playlistimg" src="http://i.ytimg.com/vi/'+ id +'/1.jpg" />' +
	'	' + title +
	'	</a>' +
	'	<button class="btn btn-xs btn-danger playlistremove">' +
	'		<i class="glyphicon glyphicon-remove"></i>' +
    	'	</button></li>'
	).hide().fadeIn());
}


function loadRedditPlaylist(subreddit) {
    $("#txtSearch").addClass("loading");
    $.ajax({
	url: 'reddit/redditrss.php?reddit=' + subreddit,
	success: function (data) {
	    $('#grid').empty();
	    $(data).find('item').each(function () {
		var id = $(this).children('a').text();
		var title = $(this).children('title').text();
		$("#txtSearch").removeClass("loading");

		item = $("#grid").append('<div class="video" ' +
		'style="background-image:url(http://i.ytimg.com/vi/' + id + '/1.jpg);">' +
		'<a href="http://www.youtube.com/watch?v=' + id + '" class="title"> ' + title + '</a>' +
		'<div class="playoverlay">&nbsp;</div>' +
		'<span class="related" style="display:none;">' +
		'<a href="#" data-href="yt.php?action=related&id=' + id + '"><i class="glyphicon glyphicon-search"></i> Related</a></span></div>');

	    });
	}
    });
}

function getplaylist(id) {
    $.ajax({
	url: 'store.php?action=get&id=' + id,
	success: function (data) {
	    if (data.indexOf("_instadjerr_") == -1) {
		var jsonobject = JSON.parse(data, function (key, value) {
		    if (typeof(value) == 'string') {
			addtoplaylist(key, value, true);
		    }

		});
	    } else {
		alert("error loading playlist, please contact instadj@fredsted.me");
	    }
	}
    });

}