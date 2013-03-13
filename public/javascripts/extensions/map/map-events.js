
//==================================================================//

this.MapEvents = {}

//==================================================================//

MapEvents.MOUSE_DOWN           = "MapEvents.MOUSE_DOWN";
MapEvents.MOUSE_UP             = "MapEvents.MOUSE_UP";
MapEvents.MOUSE_MOVE           = "MapEvents.MOUSE_MOVE";

MapEvents.DRAGGING_MAP         = "MapEvents.DRAGGING_MAP";
MapEvents.MAP_MOVING           = "MapEvents.MAP_MOVING";
MapEvents.ZOOM_CHANGED         = "MapEvents.ZOOM_CHANGED";

MapEvents.UPDATE_LATLON        = "MapEvents.UPDATE_LATLON";
MapEvents.OPEN_STYLE           = "MapEvents.OPEN_STYLE";

MapEvents.STYLE_CHANGED        = "MapEvents.STYLE_CHANGED";
MapEvents.COLORBAR_CHANGED     = "MapEvents.COLORBAR_CHANGED";
MapEvents.CONTRAST_CHANGED     = "MapEvents.CONTRAST_CHANGED";
MapEvents.LUMINOSITY_CHANGED   = "MapEvents.LUMINOSITY_CHANGED";
MapEvents.BW_METHOD_CHANGED    = "MapEvents.BW_METHOD_CHANGED";
MapEvents.DATA_SOURCE_CHANGED  = "MapEvents.DATA_SOURCE_CHANGED";

MapEvents.MOUSE_UP_WIHTOUT_AUTOMOVE  = "MapEvents.MOUSE_UP_WIHTOUT_AUTOMOVE";

//==================================================================//

MapEvents.removeAllListeners = function (){
   $(window).off(MapEvents.UPDATE_LATLON);
   $(window).off(MapEvents.OPEN_STYLE);
   $(window).off(MapEvents.STYLE_CHANGED);
   $(window).off(MapEvents.COLORBAR_CHANGED);
   $(window).off(MapEvents.CONTRAST_CHANGED);
   $(window).off(MapEvents.LUMINOSITY_CHANGED);
   $(window).off(MapEvents.BW_METHOD_CHANGED);
   $(window).off(MapEvents.DATA_SOURCE_CHANGED);
   $(window).off(MapEvents.MOUSE_UP_WIHTOUT_AUTOMOVE);
}