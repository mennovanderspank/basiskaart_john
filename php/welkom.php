<?php
$voornaam = $_POST['voornaam'];
$achternaam = $_POST['achternaam'];
$geslacht = $_POST['geslacht'];
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Voorbeeld PHP</title>
    </head>
    <body>
        <h1>Welkom op site <?php echo $voornaam; ?></h1>
        <?php
        if ($geslacht == "man") {
            echo "<h2>Hoe is het meneer ".$achternaam."?</h2>";
        } else {
            echo "<h2>Hoe is het mevrouw ".$achternaam."?</h2>";
        }
        ?>
    </body>
</html>
