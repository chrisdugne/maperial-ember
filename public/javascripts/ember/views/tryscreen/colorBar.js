
function renderColorBar()
{
	$("#colorbar").dialogr({
		position : [80,110],
		closeOnEscape: false,
		dialogClass: 'no-close'
	});
	
}

function cleanColorBar()
{
	$("#colorbar").remove();
}