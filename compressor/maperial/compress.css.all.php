<?php

//-----------------------------------------------------//

include('../yuicompressor/yuicompressor.php');

//-----------------------------------------------------//

$options = array('type' => 'css',
                 'linebreak' => false,
                 'verbose' => false,
                 'nomunge' => false,
                 'semi' => false,
                 'nooptimize' => false);

//-----------------------------------------------------//

$yui = new YUICompressor("../yuicompressor/yuicompressor-2.4.8pre.jar", "../yuicompressor/tmpfiles", $options);

//-----------------------------------------------------//

$yui->addFile("../../target/scala-2.10/resource_managed/main/public/stylesheets/bootstrap/bootstrap.min.css");

$yui->addFile("../../public/stylesheets/libs/bootstrap-image-gallery.css");
$yui->addFile("../../public/stylesheets/libs/jquery-ui-1.9.2.custom.min.css");
$yui->addFile("../../public/stylesheets/libs/slideronoff.css");
$yui->addFile("../../public/stylesheets/libs/jquery.selectbox.css");

$yui->addFile("../../public/stylesheets/mapediting/colorpicker.css");
$yui->addFile("../../public/stylesheets/mapediting/ajaxwaitspin.css");

$yui->addFile("../../public/stylesheets/global.css");
$yui->addFile("../../public/stylesheets/overall.css");

$yui->addFile("../../public/stylesheets/pages/maperial.css");

//-----------------------------------------------------//

$code = $yui->compress();

//-----------------------------------------------------//

$file = "../min/maperial.min.css";
$fh = fopen($file, 'w') or die("Can't create new file");
fwrite($fh, $code);
fclose($fh);

//-----------------------------------------------------//

echo "Done !";

?>