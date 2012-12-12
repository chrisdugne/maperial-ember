/*
 * ----------------------------------------------

 * jQuery File Upload Plugin JS Example 6.11
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 * 
 * ----------------------------------------------
 * 
 * Modified to be a mapnify extension
 * 
 */

var extensionUpload = new Object();
extensionUpload.init = function () {
    
	//-----------------------------------//

	p("init extensionUpload");
	
	// init templates
    factory();
    
    //-----------------------------------//

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: '//map.x-ray.fr:8081/dataset'
    });

    // Enable iframe cross-domain access via redirect option:
//    $('#fileupload').fileupload(
//        'option',
//        'redirect',
//        window.location.href.replace(
//            /\/[^\/]*$/,
//            '/cors/result.html?%s'
//        )
//    );

//    dataType:"jsonp",
//    contentType:"application/x-javascript",
    $('#fileupload').fileupload('option', {
        url: '//map.x-ray.fr:8081/dataset',
        maxFileSize: 5000000,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        process: [
            {
                action: 'load',
                fileTypes: /^image\/(gif|jpeg|png)$/,
                maxFileSize: 20000000 // 20MB
            },
            {
                action: 'resize',
                maxWidth: 1440,
                maxHeight: 900
            },
            {
                action: 'save'
            }
        ]
    });
    
    // Upload server status check for browsers with CORS support:
    if ($.support.cors) {
        $.ajax({
            url: '//map.x-ray.fr:8081/dataset',
            type: 'HEAD'
        }).fail(function () {
            $('<span class="alert alert-error"/>')
                .text('Upload server currently unavailable - ' +
                        new Date())
                .appendTo('#fileupload');
        });
    }
    
    //-------------------------------------------------------------------//  

    $('#fileupload').bind('fileuploaddone', 
		function (e, data) 
		{
    		// data.files[0] = file envoyé
    		// data.result.files[0] = file retour upload
			
    		window.Webapp.user.datasets.pushObject(data.files[0]);

    		var dataset = {
				name : data.result.files[0].name,
				size : data.result.files[0].size,
				uid  : data.result.files[0].id
    		};
    		
    		DatasetManager.addDataset(dataset);
		}
    );

    $('#fileupload').bind('fileuploadfail', 
		function (e, data) 
		{
			console.log("Upload Fail");
		}
    );
    

};
