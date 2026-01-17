<?php

define('SECURE_ACCESS', true);

require_once __DIR__ . '/config/config.php';

session_start();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">

    <link rel="stylesheet" href="css/home.css">
    
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
                    <li class="list1"><a href="<?php echo $base_url?>auth/categories.php">Categories</a></li>
                    <li class="list1"><a href="<?php echo $base_url?>auth/hire.php">Hire Freelancer</a></li>
                    <li class="list1"><a href="<?php echo $base_url?>auth/about.php">About Us</a></li>
                    <li class="list1"><a href="<?php echo $base_url?>auth/pricing.php">Pricing <span class="new">NEW</span></a></li>
                </ul>
            </nav>

            <div class="login">
                <a href="<?php echo $base_url?>auth/login.php">Login</a>
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

<hr class="line">

<div class="space"></div>

<section class="hero">
    <div class="div1">
        <div class="hero-content">
            <h1 class="hero-title">
                Where Opportunities Meet <span id="typewriter"></span>
            </h1>
            <br>
            <p class="hero-text">Connecting job seekers and employers through smart matching, trusted opportunities, and growth-focused careers</p>
        </div>
        <div class="hero-button">
            <button class="btn">Get Started</button>
        </div>
    </div>

    <div class="div2">
        <div class="img-container"><img class="hero-img" src="<?php echo $base_url?>images/person.jpg" alt=""></div>
    </div>

    <div class="animation">
        <div class="animation-container">
    </div>
</section>

<hr class="hr1">
<section class="section-2">
    <div class="container-2">
        <h1 class="container-2-title">Why Choose Joblifyr</h1> 
        <div class="container-2-head">
            <div class="container-2-head-1">
                <h5>
                    <input class="input" type="checkbox" checked disabled>Built to simplify job searching and hiring for everyone
                </h5>
                <h5>
                    <input class="input" type="checkbox" checked disabled>Joblifyr removes the noise and connects people to real opportunities
                </h5>
                <h5>
                    <input class="input" type="checkbox" checked disabled>Everything You Need in One Job Platform
                </h5>
                <h5>
                    <input class="input" type="checkbox" checked disabled>A Smarter Way to Find Jobs and Hire Talent
                </h5>
                <h5>
                    <input class="input" type="checkbox" checked disabled>Finding the Right Job Shouldn’t Be Hard
                </h5>
            </div>
            <img class="img-work" src="<?php echo $base_url?>images/person1.png" alt="">
        </div>
    </div>
</section>

<section class="section-3">
    <div class="container-3">
        <div class="container-inside">
            <h1>Popular Categories</h1>
        </div>
    </div>
</section>

<script>
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");

    burger.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });

    const words = ["Talent", "Skills", "Potential", "Ability", "Experience"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const textElement = document.getElementById("typewriter");

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 1200);
            }
        } else {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }

        setTimeout(typeEffect, isDeleting ? 60 : 120);
    }

    typeEffect();
</script>


    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>