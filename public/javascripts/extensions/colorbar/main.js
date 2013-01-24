
this.ExtensionColorbar = {};

ExtensionColorbar.init = function (menuDiv, colorbarContent, defaultStyle) 
{
	ExtensionColorbar.bar = new ColorBar.Bar(50,355,menuDiv,50,40,true,25.4,375.89,false);
	ExtensionColorbar.bar.Import(colorbarContent);

	TileRenderer.SetStyle(defaultStyle);
}

ExtensionColorbar.fillContent = function (colorbarContent) 
{
	return ExtensionColorbar.bar.Export(colorbarContent);
}