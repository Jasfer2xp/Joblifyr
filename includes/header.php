<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<style>
    *{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body{
        background-color: #100a0afa;
    }

    nav{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="<?php echo $base_url?>">Home</a></li>
                <li><a href="<?php echo $base_url?>auth/login.php">Login</a></li>
                <li><a href="<?php echo $base_url?>auth/register.php">Register</a></li>
            </ul>
        </nav>
    </header>
</body>
</html>