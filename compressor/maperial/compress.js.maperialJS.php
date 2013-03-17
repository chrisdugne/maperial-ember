<?php

//-----------------------------------------------------//

$cmd = "rm ../min/maperialjs.min.js;";
$cmd .= "java -jar ../compiler.jar ";

//-----------------------------------------------------//

$cmd .= " --js " . "../../public/javascripts/libs/jquery.mousewheel.min.js";
$cmd .= " --js " . "../../public/javascripts/webapp/utils.js";

// -------------   MaperialJS ------------------

// libs
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/libs/gl-matrix-min.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/libs/coordinate-system.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/libs/geoloc.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/libs/fabric.all.1.0.6.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/libs/colorpicker.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/libs/RGBColor.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/libs/hashmap.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/libs/canvasutilities.js";

// rendering 
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/rendering/gl-tools.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/rendering/gl-rasterlayer.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/rendering/gl-tile.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/rendering/gl-vectoriallayer.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/rendering/render-line.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/rendering/render-text.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/rendering/tile-renderer.js";

// modules
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/events.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/source.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/parameters.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/mouse.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/hud.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/renderer.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/mover.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/styles-manager.js";

// edition
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/edition/boundingbox-drawer.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/edition/colortool.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/edition/symbolizer.js";
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/edition/style-menu.js";

// maperial
$cmd .= " --js " . "../../public/javascripts/extensions/maperial/maperial.js";

// output
$cmd .= " --js_output_file " . "../min/maperialjs.min.js ";
$cmd .= " --language_in ECMASCRIPT5 ";


// execute the command
exec($cmd . ' 2>&1', $raw_output);
 
// add line breaks to show errors in an intelligible manner
$flattened_output = implode("\n", $raw_output);

 // execute the command
exec($cmd);

//-----------------------------------------------------//

echo $flattened_output;

//-----------------------------------------------------//

$cmd = "cp ../min/maperialjs.min.js /Users/mad/Projects/Maperial/mycarto/wwwClient/js/min/ ";
exec($cmd);

?>