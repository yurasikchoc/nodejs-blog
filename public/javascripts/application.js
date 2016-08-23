
$( document ).ready(function() {
	$('.delete-post').click(function(e){
		e.preventDefault();
		var path = $(this).attr("href");
		$.ajax({
    		url: path,
    		type: 'DELETE',
    		success: function(result) {
      			window.location = "/";
   		 	}
		});
	});
	$('.refresh-comments').click(function(e){
		e.preventDefault();
		var path = $(this).attr("href");
		$.ajax({
    		url: path,
    		type: 'GET',
    		success: function(result) {
      			$('.comments-list').html(result)
   		 	}
		});
	});
});