jQuery(document).ready(function ($) {
	var $popup = $('#embed-popup'),
		$wrap = $('#embed-popup-wrap'),
		$embedurl = $('#awsm_url'),
		$shortcode= $('#shortcode');
		$message= $('#embed_message');
	var fileurl="";
	//Opens Embed popup
	$('body').on('click', '.awsm-embed', function (e) {
		e.preventDefault();
		$wrap.show();
		window.embed_target = $(this).data('target');
		$(this).magnificPopup({
			type: 'inline',
			alignTop: true,
			callbacks: {
				open: function () {
					// Change z-index
					$('body').addClass('mfp-shown');
					// Save selection
					mce_selection = (typeof tinyMCE !== 'undefined' && tinyMCE.activeEditor != null && tinyMCE.activeEditor.hasOwnProperty('selection')) ? tinyMCE.activeEditor.selection.getContent({
						format: "text"
					}) : '';
				},
				close: function () {
					// Remove narrow class
					$popup.removeClass('generator-narrow');
					// Clear selection
					mce_selection = '';
					// Change z-index
					$('body').removeClass('mfp-shown');
				}
			} 
		}).magnificPopup('open');
	});	
	//Update shortcode on change
 	$( ".embed_download" ).change(function() {
 		updateshortcode();
	});
	$('.embedval').blur(function(){
		updateshortcode();
	});

	//Tabs Support
	$('ul.tabs').delegate('li:not(.current)', 'click', function () {
            $(this).addClass('current').siblings().removeClass('current')
                .parents('div.section').find('div.box').eq($(this).index()).fadeIn(150).siblings('div.box').hide();
    });

	//Toggle advanced options
	$("#adv_options").click(function(){
	  $(".advanced_options").toggle();
	});
    //Wordpress Uploader
    $('#upload_doc').click(open_media_window);

 	//Insert Media window
 	function open_media_window() {

 		if (this.window === undefined) {
        this.window = wp.media({
                title: 'Embed Any Documet',
                multiple: false,
                library: {
					type: 'documents'
				},
                button: {text: 'Insert'}
            });
 
        var self = this; // Needed to retrieve our variable in the anonymous function below
        this.window.on('select', function() {
                var file = self.window.state().get('selection').first().toJSON();
                fileurl=file.url;
                $shortcode.text(getshortcode(file.url ));
                 
            });
   		} 
	    this.window.open();
	    return false;
    }
    //to getshortcode
    function getshortcode(url){
    	var height=$('#ead_height').val(),width=$('#ead_width').val(),download=$('#ead_download').val(),heightstr="",widthstr="",downloadstr="";
    	if(height!=emebeder.default_height) { heightstr = ' height="'+height+'"'; }
    	if(width!=emebeder.default_width) { widthstr = ' width="'+width+'"'; }
    	if(download!=emebeder.download) { downloadstr = ' download="'+download+'"'; }
    	return '[embedall url="' + url + '"' + widthstr + heightstr + downloadstr +']';

    }
    //Add url
    $('#add_url').click(awsm_embded_url);
    function awsm_embded_url(){
    	var checkurl = $embedurl.val();
    	if (checkurl!='') {
				 validateurl(checkurl);
			} else {
				updateshortcode();
			}
    	
    }
    //Validate file url
    function validateurl(url){
    	$.ajax({
                type: 'POST',
                url: emebeder.ajaxurl,
				dataType: 'json',
                data: {  action: 'validateurl',
						 furl:url },
                success: function(data) {
					  if(data.status){
					  	fileurl =url;
						updateshortcode();
						showmsg(''); 
					  }else{
					  	showmsg(data.message); 
					  } 
					   
                },
            });
    }
    //Show Message
    function showmsg(msg){
    	$message.text(msg);
    }
    //insert Shortcode
    $('#insert_doc').click(awsm_shortcode);
    function awsm_shortcode(){
    	if(fileurl){
    		wp.media.editor.insert($shortcode.text());
    		$.magnificPopup.close();	
    	}
    	
    }
    function updateshortcode(){
    	if(fileurl){
    		$shortcode.text(getshortcode(fileurl));
    	}else{
    		$shortcode.text('');
    	}
    }
    // Close Embed dialog
	$('#embed-popup').on('click', '.cancel_embed', function (e) {
		// Close popup
		$.magnificPopup.close();
		// Prevent default action
		e.preventDefault();
	});
});