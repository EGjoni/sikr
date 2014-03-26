$(document).ready(function(){
	$("#search").outerHeight($("#query").outerHeight());
	$("#search").css("line-height", $("#search").height()+"px");
		
	var initusername = "";
	var username = "";
	var query = "";
	var poll = "false";
	var first = true;
	var lastArchivedStatus = 0;
	var lastTotalStatus = "[computing]";
	var polltime = 5000;
	var resubmit = true;
	$("#search").click(function(){
		username = $("#username").val();
		if (username != initusername) {
			first = true;
			lastArchivedStatus = 0;
			lastTotalStatus = "[computing]";
			polltime = 5000;
			initusername = username;
			$("#progress").stop();
			$("#progress").width(0);
		} 
		query = $("#query").val();
		if (username.length == 0) {
			$("#status").text("Whose blog am I supposed to search? How am I supposed to know? "+
					"Oh man, I can't do anything right. I'm such a failure. Now Google "+
					"will never ask me to prom.");	
					$("#status").animate({
							"padding-top": "10px",
							"padding-bottom": "10px"
					}, 200, function(){});
		} else {
			var args = { 
				username: username,
				query: query
			};
			console.log(args);
			$.ajax({
				url: "initiate_index?username="+username,
				success: function(data){
					var result = JSON.parse(data);
					if (result.valid == "false") {
						$("#status").text("lol, that's not even a real name.");	
						$("#status").animate({
								height: "30px"
						}, 200, function(){});
					} else if (result.valid == "true") {
						$("#status").text("please wait while we index your blog");	
						$("#status").animate({
								"padding-top": "10px",
								"padding-bottom": "10px"
						}, 200, function(){
							$("#progress").css("margin-top", "-"+$("#status").outerHeight()+"px");
							$("#progress").show();
						});
						console.log("valid");
						checkProgress();
						//poll = true;
						
					}
				}
			});
			getResults();
		}
	});
	
	function checkProgress() {
		var progressText = $("#progress-text");
		var progressBar = $("#progress");
		var status = $("#status");
		console.log("checking progress");
		$.ajax({
			url: "archive_check?username="+username,
			success: function(data){
				var result = JSON.parse(data);
				if (result.archiving == "true" || first) {
					var displayString = "Please wait while we index your blog: "
						+ lastArchivedStatus + " out of " + lastTotalStatus + 
						" posts indexed so far. </br> In the meantime, we'll "+
						"show you any results we come across below. </br>";
					$(status).html(displayString);
					var percentDone =((result.archived/result.total)*100)+"%";
					lastTotalStatus = result.total;
					$(progressText).html(displayString);
					
					$(progressBar).animate(
						{
							width: percentDone	
						}, {
							duration: first?2000:polltime,
							progress: function(animation, progress, remainingMs) {
								inferredArchivedStatus = parseInt(lastArchivedStatus) + Math.round( (result.archived - lastArchivedStatus) * progress);
								//console.log(inferredArchivedStatus);
								var inferredString = "We're still indexing your blog: "
									+ inferredArchivedStatus + " out of " + lastTotalStatus + 
									" posts indexed so far. </br> In the meantime, we'll "+
									"show you any results we come across below. </br>";
								$(progressText).html(inferredString);
								$(status).html(inferredString);
								$(progressBar).css("margin-top", "-"+$(status).outerHeight()+"px");
							}, 
							complete: function(){
								if(lastArchivedStatus == result.archived && polltime <= 40000) {
									polltime*=1.4; 	
								} else if (result.archived - lastArchivedStatus >= 40 && polltime >5000) { 
									polltime*=.80;
								}
								//console.log(polltime);
								lastArchivedStatus = result.archived;
								checkProgress();
								getResults();
							}
						});
					
					
					$(progressText).width($(status).width());
					$(progressBar).height($(status).height());
					first = false;
					//setTimeout(, 5000);
					
					
				} else {
					$(status).text("Your blog has been fully indexed.");
					$(progressBar).width(0);
				}
			}
		});
	}
		
	function getResults() {
		
		$.ajax({
			url: "initiate_search?username="+username+"&query="+query,
			success: function(data){
				var result = JSON.parse(data);
				var html = "";
				for(var i=0; i<result.length; i++){
					html+= "<div class='result'><a href="+result[i].post_link+">"+result[i].post_link+"</a></br> "+result[i].substr+"</br></div>";
				}
				$("#results").html(html);						
			}
		});		
	}
	
	$("#username").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#search").click();
	    }
	});
	
	$("#query").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#search").click();
	    }
	});
	
});
