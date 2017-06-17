/*$('#commentform').submit(function(event){
  event.preventDefault()
  var typedIn = $('#new_comment').val()
  console.log('typedIn', $('#new_message'), typedIn)
  $.post('/comments',{typedIn: typedIn}, function(data,status){
    console.log('hi',data,status)
    // $(".post-content").text(data)
    $('#comment').after('<div class="actionBox"><ul class="commentList"><li><div class="commentText"><p class="">'+ data.name +'</p> <span class="date sub-text">'+ data.createdAt +'</span></div></li></ul></div></div>')
  })
})*/