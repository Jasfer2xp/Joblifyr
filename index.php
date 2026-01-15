<?php

    require_once __DIR__ . '../config/config.php';
    session_start();


?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

    <link rel="stylesheet" href="<?php echo $base_url?>css/home.css">
    
</head>
<body>
    
<header>
    <div class="header-container">
        <div class="header">

            <div class="logo">
                <h4>Joblifyr</h4>
            </div>

            <nav class="menu">
                <ul class="links">
                    <li><a href="#">Categories</a></li>
                    <li><a href="#">Jobs</a></li>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Pricing <span class="new">NEW</span></a></li>
                </ul>
            </nav>

            <div class="login">
                <a href="#">Login</a>
            </div>

            <div class="burger" id="burger">
                ☰
            </div>

        </div>
    </div>

    <div class="mobile-menu" id="mobileMenu">
        <a href="#" class="mobile-login">Login</a>
        <ul>
            <li><a href="#">Categories</a></li>
            <li><a href="#">Jobs</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Pricing</a></li>
        </ul>
    </div>
    
</header>
<hr>
<div class="space"></div>

<section class="hero">
    <div class="div1">
        <div class="hero-content">
            <h1 class="hero-title">Where Opportunities Meet Talent</h1><br>
            <p class="hero-text">Connecting job seekers and employers through smart matching, trusted opportunities, and growth-focused careers</p>
        </div>
    </div>

    <div class="div2">
        <div class="img-container"><img class="hero-img" src="<?php echo $base_url?>images/person.jpg" alt=""></div>
    </div>
</section>

<section class="hero2">

</section>


<script>
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");

    burger.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });
</script>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>