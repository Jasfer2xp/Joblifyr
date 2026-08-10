<?php

class User {

    private PDO $db;

    public function __construct($pdo) {
        $this->db = $pdo;
        $this->initTables();
    }

    private function initTables(): void {
        // Ensure main users table exists
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'job_seeker',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");

        // Ensure pending_verifications table exists for bot/fake email protection
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS pending_verifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                verification_code VARCHAR(6) NOT NULL,
                attempts INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    }

    /**
     * Creates a pending verification record with a random 6-digit code.
     * Prevents bot emails from entering the main users database until verified.
     */
    public function createPendingVerification(array $data): string {
        if (
            empty($data['email']) ||
            empty($data['first_name']) ||
            empty($data['last_name']) ||
            empty($data['password'])
        ) {
            throw new Exception("All fields are required");
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email address");
        }

        if (strlen($data['password']) < 8) {
            throw new Exception("Password must be at least 8 characters");
        }

        // Check if email already exists in active users table
        $check = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$data['email']]);
        if ($check->fetch()) {
            throw new Exception("This email address is already registered.");
        }

        // Clean up any stale expired records
        $this->purgeExpired();

        // Generate 6-digit random security code
        $code = sprintf('%06d', mt_rand(0, 999999));
        $passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

        // Delete existing pending record for this email if any
        $del = $this->db->prepare("DELETE FROM pending_verifications WHERE email = ?");
        $del->execute([$data['email']]);

        // Insert pending verification record valid for 15 minutes
        $stmt = $this->db->prepare("
            INSERT INTO pending_verifications (email, first_name, last_name, password_hash, verification_code, expires_at)
            VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))
        ");

        $stmt->execute([
            $data['email'],
            $data['first_name'],
            $data['last_name'],
            $passwordHash,
            $code
        ]);

        return $code;
    }

    /**
     * Verifies the 6-digit code.
     * If successful, moves the user into the main users database and deletes pending data.
     * If failed or expired, throws an exception and removes the unverified attempt.
     */
    public function verifyCode(string $email, string $code): array {
        $email = trim($email);
        $code = trim($code);

        $stmt = $this->db->prepare("
            SELECT * FROM pending_verifications 
            WHERE email = ?
        ");
        $stmt->execute([$email]);
        $pending = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$pending) {
            throw new Exception("No pending registration found for this email address. Please register again.");
        }

        // Check expiration
        if (strtotime($pending['expires_at']) < time()) {
            // Delete expired record
            $del = $this->db->prepare("DELETE FROM pending_verifications WHERE email = ?");
            $del->execute([$email]);
            throw new Exception("Verification code has expired. Please register again.");
        }

        // Validate code match
        if ($pending['verification_code'] !== $code) {
            // Increment attempt count
            $attempts = $pending['attempts'] + 1;
            if ($attempts >= 5) {
                // Too many failed attempts: delete pending record to prevent brute force
                $del = $this->db->prepare("DELETE FROM pending_verifications WHERE email = ?");
                $del->execute([$email]);
                throw new Exception("Too many failed attempts. Pending registration cancelled for security.");
            } else {
                $upd = $this->db->prepare("UPDATE pending_verifications SET attempts = ? WHERE email = ?");
                $upd->execute([$attempts, $email]);
            }
            throw new Exception("Invalid verification code. Please check your email.");
        }

        // CODE IS VALID! Insert into active users database
        $insert = $this->db->prepare("
            INSERT INTO users (email, first_name, last_name, password)
            VALUES (?, ?, ?, ?)
        ");
        $insert->execute([
            $pending['email'],
            $pending['first_name'],
            $pending['last_name'],
            $pending['password_hash']
        ]);

        $userId = $this->db->lastInsertId();

        // Remove from pending_verifications
        $del = $this->db->prepare("DELETE FROM pending_verifications WHERE email = ?");
        $del->execute([$email]);

        return [
            'id' => $userId,
            'email' => $pending['email'],
            'first_name' => $pending['first_name'],
            'last_name' => $pending['last_name']
        ];
    }

    public function login(string $email, string $password): array {
        $email = trim($email);
        if (empty($email) || empty($password)) {
            throw new Exception("Please enter both email address and password.");
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            throw new Exception("Account does not exist or has not been verified yet. Please register first.");
        }

        if (!password_verify($password, $user['password'])) {
            throw new Exception("Incorrect password. Please try again.");
        }

        return $user;
    }

    public function purgeExpired(): void {
        $this->db->exec("DELETE FROM pending_verifications WHERE expires_at < NOW()");
    }
}