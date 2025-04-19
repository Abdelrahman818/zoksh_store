<?php

  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");

  require 'vendor/autoload.php';
  use Firebase\JWT\JWT;
  use Firebase\JWT\Key;

  if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $postedData = file_get_contents('php://input');
    $decoded = json_decode($postedData, true);
    $type = '';

    if (isset($decoded['type']))
      $type = $decoded['type'];

    else
      $type = $_POST['type'];
    
    if ($type === 'signup') {
      $name = $decoded['name'];
      $email = $decoded['email'];
      $phone = $decoded['phone'];
      $pwd = $decoded['pwd'];
      $sql = "
        SELECT *
        FROM users
        WHERE name = :name OR email = :email OR phone = :phone
      ";
      $data = DBConnection($sql, [
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone
      ]);
      if (!empty($data)) {
        foreach ($data as $user) {
          if ($user['name'] === $name) {
            echo json_encode(['msg' => 'nameErr']);
            exit;
          } else if ($user['email'] === $email) {
            echo json_encode(['msg' => 'emailErr']);
            exit;
          } else if ($user['phone'] === $phone) {
            echo json_encode(['msg' => 'phoneErr']);
            exit;
          }
        }
      }
      $hashedPwd = password_hash($pwd, PASSWORD_DEFAULT);
      $userPayload = [
        'name' => $name,
        'role' => 'usr'
      ];
      $token = generateToken($userPayload);
      $addNewUser = "
        INSERT INTO users (id, name, email, pwd, phone, role)
        VALUES (NULL, :name, :email, :pwd, :phone, 'usr')
      ";
      DBConnection($addNewUser, [
        ':name' => $name,
        ':email' => $email,
        ':pwd' => $hashedPwd,
        ':phone' => $phone,
      ]);
      echo json_encode(['msg' => 'userAdded', 'token' => $token, 'pwd' => $hashedPwd]);
    } else if ($type === 'login') {
      $name = $decoded['name'];
      $pwd = $decoded['pwd'];
      $sql = "SELECT * FROM users WHERE name = :name";
      $res = DBConnection($sql, ['name' => $name]);

      if (!empty($res)) {
        $storedHash = $res[0]['pwd'];
        $val = password_verify($pwd, $storedHash);

        if ($val) {
          $user = [
            'name' => $res[0]['name'],
            'role' => $res[0]['role']
          ];
          $token = generateToken($user);

          echo json_encode([
            'msg' => 'loginSuccess',
            'token' => $token,
            'role' => $res[0]['role']
          ]);
        } else {
          echo json_encode(['msg' => 'invPwd']);
        }
      } else {
        echo json_encode(['msg' => 'invUsr']);
      }
    } else if ($type === 'contact') {
      $name = $decoded['name'];
      $user = $decoded['user'];
      $phone = $decoded['phone'];
      $msg = $decoded['msg'];
      $subj = $decoded['subj'];
      $date = date('Y-m-d H:i:s');
      $sql = "
        INSERT INTO
          contacts (id, name, phone, email, msg, subj, date)
        VALUES
          (NULL, :name, :phone, :email, :msg, :subj, :date)
      ";
      DBConnection($sql, [
        ':name' => $name,
        ':phone' => $phone,
        ':email' => $email,
        ':msg' => $msg,
        ':subj' => $subj,
        ':date' => $date
      ]);
    } else if ($type === 'uploadTemps') {
      if (!isset($decoded['img'])) {
        echo json_encode(["error" => "No image received"]);
        exit;
      }
      $img = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $decoded['img']));

      if (!$img) {
        echo json_encode(["error" => "Invalid image"]);
        exit;
      }
      $sql = "
        INSERT INTO templates (id, img, img_for)
        VALUES (NULL, :img, 'shirts')
      ";

      DBConnection($sql, [':img' => $img]);

      echo json_encode(["success" => "Image uploaded successfully"]);
    } else if ($type === 'getMsgs') {
      $sql = "
        SELECT
          *
        FROM
          contacts
      ";
      echo json_encode(DBConnection($sql));
    } else if ($type === 'getOrders') {
      $sql = "SELECT * FROM orders";
      echo json_encode(DBConnection($sql));
    } else if ($type === 'updateStatus') {
      $id = $decoded['id'];
      $status = $decoded['status'];
      $sql = "UPDATE `orders` SET `order_status` = :status WHERE `orders`.`order_id` = :id;";
      DBConnection($sql, [
        ':id' => $id,
        ':status' => $status
      ]);
      echo json_encode(['id' => $id, 'stat' => $status]);
    } else if ($type === 'checkToken') {
      $token = $decoded['token'];
      $tokenStat = tokenValidation($token);
      echo json_encode($tokenStat);
    } else if ($type === 'getAllUsers') {
      $sql = "
        SELECT
          id, name, phone, role, email
        FROM
          users
      ";
      echo json_encode(DBConnection($sql));
    } else if ($type === 'upload') {
      $productName = $_POST['productName'] ?? '';
      $price = $_POST['price'] ?? '';
      $info = $_POST['info'] ?? '';
      $pType = $_POST['pType'] ?? '';
      $sql1 = "
        INSERT INTO templates (id, img, name, price, infos, product_type)
        VALUES (NULL, :img, :name, :price, :infos, :product_type)
      ";
      $sql2 = "
        INSERT INTO imgs (id, temp_id, img)
        VALUES (NULL, :temp_id, :img)
      ";
      $uploadDir = __DIR__ . '/upload/';
      if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
      }
      $templateFile = $_FILES['template'] ?? null;
      $templatePath = '';
      if ($templateFile && $templateFile['error'] === 0) {
        $templateName = uniqid('template_') . '_' . basename($templateFile['name']);
        $templatePath = 'upload/' . $templateName;
        move_uploaded_file($templateFile['tmp_name'], $uploadDir . $templateName);
      }
      $imagePaths = [];
      if (isset($_FILES['images'])) {
        foreach ($_FILES['images']['tmp_name'] as $index => $tmpName) {
          if ($_FILES['images']['error'][$index] === 0) {
            $imageName = uniqid('img_') . '_' . basename($_FILES['images']['name'][$index]);
            $fullPath = $uploadDir . $imageName;
            move_uploaded_file($tmpName, $fullPath);
            $imagePaths[] = 'upload/' . $imageName;
          }
        }
      }
      try {
        $db = new PDO("mysql:host=localhost;dbname=zoksh_store", "root", "");
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $db->prepare($sql1);
        $stmt->execute([
          ':img' => $templatePath,
          ':name' => $productName,
          ':price' => $price,
          ':infos' => $info,
          ':product_type' => $pType
        ]);
        $templateId = $db->lastInsertId();
      } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        exit;
      }
      foreach ($imagePaths as $imgPath) {
        DBConnection($sql2, [
          ':temp_id' => $templateId,
          ':img' => $imgPath
        ]);
      }
      echo json_encode([
        'status' => 'success',
        'message' => 'Product uploaded successfully.',
        'productName' => $productName,
        'price' => $price,
        'info' => $info,
        'template' => $templatePath,
        'images' => $imagePaths
      ]);
    } else if ($type === 'updateRole') {
      $id = $decoded['id'];
      $role = $decoded['newRole'];
      $sql = "UPDATE `users` SET `role` = :role WHERE `users`.`id` = :id";
      DBConnection($sql, [
        ':role' => $role,
        ':id' => $id
      ]);
    } else {
      echo json_encode($decoded);
    }
  }
  function DBConnection($sql, $bindings=[]) {
    $host = "localhost";
    $dbname = "zoksh_store";
    $username = "root";
    $password = "";

    try {
      $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      
      $stmt = $db->prepare($sql);
      
      foreach ($bindings as $placeholder => $value)
        $stmt->bindValue($placeholder, $value);
      
      $stmt->execute();
      $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return $data;

    } catch (PDOException $e) {
      return json_encode(["error" => $e->getMessage()]);
    }
  }
  function generateToken($user, $secret_key = 'LMa@^A1&QN5Q@$mHKLShP&ktYrYkZRHV', $expiry_time = 3600) {
    $issuedAt = time();
    $expiration_time = ($issuedAt + $expiry_time) *24 * 30;

    $payload = [
      'iat' => $issuedAt,
      'exp' => $expiration_time,
      'data' => [
        'username' => $user['name'],
        'role' => $user['role']
      ]
    ];
    return JWT::encode($payload, $secret_key, 'HS256');
  }
  function tokenValidation($token, $secret_key='LMa@^A1&QN5Q@$mHKLShP&ktYrYkZRHV') {
    try {
      $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
  
      return [
        'msg' => 'validToken',
        'username' => $decoded->data->username,
        'role' => $decoded->data->role
      ];
    } catch (Exception $e) {
      return ['msg' => 'invalidToken', 'error' => $e->getMessage()];
    }
  }
