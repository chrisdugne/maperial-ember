// ----------------------------//
//	 Utils
// ----------------------------//

/*
 * zeroPad(5, 2) 	--> "05"
   zeroPad(1234, 2) --> "1234"
 */
function zeroPad(num, places) 
{
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

/*
 * now as YYYY-MM-DD
 */
function dateTime()
{
    var now = new Date();
    return now.getFullYear() + "-" 
    	 + zeroPad(now.getMonth()+1, 2) + "-" 
    	 + zeroPad(now.getDate(), 2);
}

/*
 * helpers for html encoding and decoding
 */
function htmlEncode(value){
	  return $('<div/>').text(value).html();
}

function htmlDecode(value){
	  return $('<div/>').html(value).text();
}