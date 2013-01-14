
this.extensionMapEditing = {};
extensionMapEditing.init = function (menuDiv,widgetDiv,map) 
{
	console.log("init extensionMapEditing");
	$(function(){
    // ok that's all we have to do to set up menu :-) 
    MapnifyMenu.init(menuDiv,widgetDiv,false,map);
	}); 
}