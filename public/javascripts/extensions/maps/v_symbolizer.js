//////////////////////////////////////////////////////////////
//Sym / param list
var SymbolizerParams = {
    PolygonSymbolizer : [ "fill", "alpha" ],
    LineSymbolizer : [ "width", "stroke", "dasharray", "alpha" , "linejoin" , "linecap" ],
};

//////////////////////////////////////////////////////////////
function GetSymbolizerParamName(symb,id){
     return SymbolizerParams[symb][id];
}

