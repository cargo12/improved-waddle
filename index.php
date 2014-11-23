<!DOCTYPE html>
<html>
<head>
	<title>Create &amp; Share YouTube Playlists with InstaDJ</title>

	<script type="text/javascript">
	   var loadplaylist = '<?php echo (isset($_GET['id']) ? preg_replace("/[^a-zA-Z0-9\s]/", "", $_GET['id']) : '') ?>';  		
	</script>

	<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
	<script src="js/jquery.dragsort-0.5.1.min.js"></script>
	<script src="js/instadj.js"></script>
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
	<link rel="stylesheet" href="instadj.css">

	<style type="text/css">
		.hidden { display: none; }
	</style>

	<meta name="description" content="With InstaDJ you can create and share playlists with ease. It's great for parties or just queueing up videos." />
	<meta charset="utf-8" />
</head>
<body>

	<div id="main">
		
		<div id="player">
			<div id="videoDiv">Click video to play</div>
		</div>
		
		<div id="share">
			
			<button class="btn btn-success" id="btnGenerate" disabled="disabled"><i class="glyphicon glyphicon-envelope glyphicon-white"></i> Share/Save</button>
	   		<div id="sharingoptions">
	   			<div id="sharethisbuttons" style="float:left;">	
					 <div id="stbtn1">
						 <a href="" id="btnGenFacebook" target="_blank">
						 	<img rel="tooltip" src="/facebook_32.png" width="32" height="32" title="Share on Facebook"  />
						 </a>
					 </div>
					 <div id="stbtn2">
						 <a href="#" id="btnGenTwitter" target="_blank">
						 	<img rel="tooltip" src="/twitter_32.png" width="32" height="32" title="Share on Twitter"  />
						 </a>						 
					 </div>
					 <div id="stbtn3" title="Email this playlist.">
						 <a href="#" id="btnGenEmail">
							<img rel="tooltip" src="/email_32.png" width="32" height="32" title="Share via e-mail" />
						 </a>
					 </div>
				</div>  
	   			<input rel="tooltip" type="text" class="input" id="playlistcode" readonly="readonly" value="" title="Playlist link. Share it!"></input>				 		
		    </div>
		</div>
		
		<div id="playlist" class="well">
			<ul class="nav nav-pills nav-stacked" id="playlistcontent"></ul>
		</div>

		<div id="playlistcontrols">
			<div class="btn-group" role="group">
				<button class="btn btn-default" id="previous"><i class="glyphicon glyphicon-fast-backward"></i> Previous</button>
				<button class="btn btn-default" id="pauseplay"><i class="glyphicon glyphicon-pause"></i> Pause/Play</button>
				<button class="btn btn-default" id="next"><i class="glyphicon glyphicon-fast-forward"></i> Next</button>
				<button class="btn btn-default" id="shuffle"><i class="glyphicon glyphicon-random"></i> Shuffle</button>
			</div>
		</div>
		
		<div id="controls">
			<a href="./" class="logo-sm"><img src="instadj.png" id="smallogo" title="Create &amp; Share YouTube Playlists with InstaDJ" /></a>

			<input type="search" id="txtSearch" class="form-control search-query" placeholder="YouTube Search…" />
			
			<div id="btngrpSearch" class="btn-group">
				 <button class="btn btn-primary" id="btnSearch"><i class="glyphicon  glyphicon-search glyphicon-white"></i> Search</button>
				 <button class="btn btn-default dropdown-toggle" id="drpdownSearchMenu" data-toggle="dropdown">
				   <span class="caret"></span>
				 </button>
				 <ul class="dropdown-menu" id="dropdownMenu">
				   <li><a href="#" id="btnFavorites">User Favorites</a></li>
				   <li><a href="#" id="btnUploads">User Uploads</a></li>
				   <li class="divider"></li>
				 </ul> 
			</div> 

			
			<div id="viewoptions" style="float:right;">
				<button class="btn btn-default" id="togglelight"    data-toggle="button"><i class="glyphicon glyphicon-adjust"></i> Theme</button>
				<button class="btn btn-default" id="togglelistview" data-toggle="button"><i class="glyphicon glyphicon-resize-small"></i> Grid</button>
			</div>
		</div>

	</div>
	<div id="grid"></div>
	
	<script src="js/json2.js"></script>

	<!-- Facebook -->
	<div id="fb-root"></div>
	<script>(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));</script>

	<!-- Analytics -->
	<script type="text/javascript">
	  var _gaq = _gaq || [];
	  _gaq.push(['_setAccount', 'UA-31010422-1']);
	  _gaq.push(['_trackPageview']);
	
	  (function() {
	    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	  })();
	</script>

	<script src="js/jquery.scrollTo.min.js"></script>
	<script src="js/bootstrap3-typeahead.min.js"></script>
	<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>

</body>
</html>
