$('#post_form').submit(function(event){
	event.preventDefault()
	var typedIn = $('#new_message').val()
	console.log('typedIn', $('#new_message'), typedIn)
	$.post('/profile',{typedIn: typedIn}, function(data,status){
		console.log('hi',data,status)
		// $(".post-content").text(data)
		$('#comments').after('<div id="panel" class="panel panel-default"><div class="panel-body"><div class="pull-left"><h2><a href="#" style="text-decoration:none color:black;"><strong></strong><hr><div id="post-content"><h4>' + data + '</h4><br><hr><div class="media"><div class="media-body"><form id="commentform" action="/comments" method="post"><input name="postId" type="hidden"><textarea id="new_comment" rows="1" placeholder="Comment" name="comment" class="form-control"></textarea><br><button id="my-btn" type="submit" class="btn">Comment</button></form></div></div></div></a></h2></div></div></div>')
	})
})