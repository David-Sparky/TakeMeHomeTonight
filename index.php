<?PHP

    include_once("./resources/CAS-1.3.4/CAS.php");
    phpCAS::client(CAS_VERSION_2_0,'cas-auth.rpi.edu',443,'/cas/');
    // SSL!
    phpCAS::setCasServerCACert("./resources/CACert.pem");//this is relative to the cas client.php file
        
    if (phpCAS::isAuthenticated()) {
        // echo "User: " . phpCAS::getUser();
        // echo "<a href='./logout.php'>Logout</a>";
      header( 'Location: landing.php' );
    } else{
        // echo "<a href='./login.php'>Login</a>";
    }
?>


<!doctype html>
<html>
<head>
  <title>Take Me Home Tonight</title>
  <link rel="stylesheet" href="resources/css/bootstrap.css">
  <link rel='stylesheet' type='text/css' href='resources/css/style.css'/> 
</head>
<body>
  <div class="page-header">
    <img class="logo" src="resources/imgs/tmht.png"> 
  </div>

  <div class="container-fluid">

    <div class="row-fluid">
      <div class="centering text-center">
        <button type="button" class="btn btn-default btn-xlarge" onClick="location.href='login.php'">Login</input>
      </div>
    </div>
  </div>
</div>
</body>
</html>