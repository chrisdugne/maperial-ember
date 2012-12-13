
// -------------------------------------------//
//	 	Symbolizer
// -------------------------------------------//

this.Symbolizer = {};

// -------------------------------------------//
//Sym / param list

Symbolizer.params = {
    PolygonSymbolizer : [ "fill", "alpha" ],
    LineSymbolizer : [ "width", "stroke", "dasharray", "alpha" , "linejoin" , "linecap" ],
};

// -------------------------------------------//

Symbolizer.getParamName = function(symb,id){
     return Symbolizer.params[symb][id];
}

