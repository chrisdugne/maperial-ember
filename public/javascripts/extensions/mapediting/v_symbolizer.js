
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

Symbolizer.default = {
   fill : "rgba(0,0,0,0)",
   stroke : "rgba(0,0,0,0)",
   width : "0",
   alpha : "1.0",
   dasharray : "",
   linejoin : "round",
   linecap : "round"
};

// -------------------------------------------//

Symbolizer.getParamName = function(symb,id){
     return Symbolizer.params[symb][id];
}

