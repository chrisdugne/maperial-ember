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

this.ExtensionUpload = {};
ExtensionUpload.init = function () 
{
	//-----------------------------------//

	console.log("init extensionUpload");
	
	// init templates
    factory();
    
    //-----------------------------------//

    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: Globals.mapServer + '/api/dataset'
    });

    $('#fileupload').fileupload('option', {
        url: Globals.mapServer + '/api/dataset',
        maxFileSize: 15000000,
        acceptFileTypes: /(\.|\/)(pst|gif|jpe?g|png)$/i,
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
            url: Globals.mapServer + '/api/dataset',
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
			
    		App.user.datasets.pushObject(data.result.files[0]);

    		var dataset = {
				name : data.result.files[0].name,
				size : data.result.files[0].size,
				uid  : data.result.files[0].datasetUID
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
