<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}
require 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

  if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $uploadDir   = __DIR__ . '/upload/';
    $webBasePath = 'https://zoksh.rf.gd/upload/';
    if (!file_exists($uploadDir)) mkdir($uploadDir, 0755, true);

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
      $res = DBConnection($sql, [':name' => $name]);

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
      $name = $decoded['user'];
      $phone = $decoded['phone'];
      $msg = $decoded['msg'];
      $subj = $decoded['subj'];
      $date = date('Y-m-d H:i:s');
      $sql = "
        INSERT INTO
          contacts (id, name, phone, msg, subj, date)
        VALUES
          (NULL, :name, :phone, :msg, :subj, :date)
      ";
      DBConnection($sql, [
        ':name' => $name,
        ':phone' => $phone,
        ':msg' => $msg,
        ':subj' => $subj,
        ':date' => $date
      ]);
      echo json_encode(['msg' => 'sent']);
    } else if ($type === 'getMsgs') {
      $sql = "
        SELECT
          *
        FROM
          contacts
      ";
      echo json_encode(DBConnection($sql), JSON_UNESCAPED_UNICODE);
    } else if ($type === 'getOrders') {
      $sql = "SELECT * FROM orders";
      echo json_encode(DBConnection($sql), JSON_UNESCAPED_UNICODE);
    } else if ($type === 'updateStatus') {
      $id = $decoded['id'];
      $status = $decoded['status'];
      $sql = "UPDATE `orders` SET `order_status` = :status WHERE `orders`.`order_id` = :id";
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
      echo json_encode(DBConnection($sql), JSON_UNESCAPED_UNICODE);
    } else if ($type === 'upload') {
        $productName = $_POST['productName'] ?? '';
        $price       = $_POST['price']       ?? '';
        $info        = $_POST['info']        ?? '';
        $pType       = $_POST['pType']       ?? '';

        $uploadDir    = __DIR__ . '/upload/';
        $webBasePath  = 'https://zoksh.rf.gd/upload/'; // Change to your actual URL

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true); // Create uploads folder if not exist
        }

        // 3) Move the main template image
        $templatePath = '';
        if (!empty($_FILES['template']) && $_FILES['template']['error'] === 0) {
            $originalName = basename($_FILES['template']['name']);
            $safeName = preg_replace('/[^A-Za-z0-9_\-\.]/', '_', $originalName);
            $fname = uniqid('template_') . '_' . $safeName;
            if (move_uploaded_file($_FILES['template']['tmp_name'], $uploadDir . $fname)) {
                $templatePath = $webBasePath . $fname;
            }
        }

        // 4) Move any gallery images
        $imagePaths = [];
        if (isset($_FILES['images'])) {
            foreach ($_FILES['images']['tmp_name'] as $i => $tmp) {
                if ($_FILES['images']['error'][$i] === 0) {
                    $originalName = basename($_FILES['images']['name'][$i]);
                    $safeName = preg_replace('/[^A-Za-z0-9_\-\.]/', '_', $originalName);
                    $iname = uniqid('img_') . '_' . $safeName;
                    if (move_uploaded_file($tmp, $uploadDir . $iname)) {
                        $imagePaths[] = $webBasePath . $iname;
                    }
                }
            }
        }

        try {
            $pdo = new PDO(
                "mysql:host=sql201.infinityfree.com;dbname=if0_38811111_zoksh_store;charset=utf8mb4",
                "if0_38811111",
                "DU9OhrTVWyOY",
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
            );

            // Insert template info
            $stmt1 = $pdo->prepare("
                INSERT INTO templates (img, name, price, infos, product_type)
                VALUES (:img, :name, :price, :infos, :product_type)
            ");
            $stmt1->execute([
                ':img'          => $templatePath,
                ':name'         => $productName,
                ':price'        => $price,
                ':infos'        => $info,
                ':product_type' => $pType
            ]);
            $templateId = $pdo->lastInsertId();

            // Insert gallery images
            $stmt2 = $pdo->prepare("
                INSERT INTO imgs (temp_id, img)
                VALUES (:temp_id, :img)
            ");
            foreach ($imagePaths as $imgPath) {
                $stmt2->execute([
                    ':temp_id' => $templateId,
                    ':img'     => $imgPath
                ]);
            }

            // Success
            echo json_encode([
                'status' => 'success',
                'msg'    => 'uploaded',
                'id'     => $templateId
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'status' => 'error',
                'msg'    => 'Database error: ' . $e->getMessage()
            ]);
        }
    } else if ($type === 'updateRole') {
      $id = $decoded['id'];
      $role = $decoded['newRole'];
      $sql = "UPDATE `users` SET `role` = :role WHERE `users`.`id` = :id";
      DBConnection($sql, [
        ':role' => $role,
        ':id' => $id
      ]);
    } else if ($type === 'getProducts') {
        $templates = DBConnection("SELECT id, img AS temp, name, price, infos, product_type FROM templates");
        $images    = DBConnection("SELECT temp_id, img FROM imgs");
        foreach ($templates as &$t) {
            $matched = array_filter($images, fn($i) => $i['temp_id'] == $t['id']);
            $t['imgs'] = array_values(array_map(fn($i) => $i['img'], $matched));
        }
        echo json_encode($templates, JSON_UNESCAPED_UNICODE);
    } else if ($type === 'createOrder') {
      $product_id = $decoded['product_id'];
      $product_name = $decoded['product_name'];
      $price = $decoded['price'];
      $quantity = $decoded['quantity'];
      $client_name = $decoded['client_name'];
      $phone = $decoded['phone'];
      $gov = $decoded['gov'];
      $area = $decoded['area'];
      $location = $decoded['location'];
      $sql = "
        INSERT INTO orders (
          order_id, product_id,
          product_name, price,
          order_status, client_name, client_phone,
          location, gov, area, quantity
        ) VALUES (
          NULL, :product_id, :product_name,
          :price, 'pending',
          :client_name, :client_phone,
          :location, :gov, :area, :quantity
        )
      ";
      DBConnection($sql, [
        ':product_id' => $product_id,
        ':product_name' => $product_name,
        ':price' => $price,
        ':client_name' => $client_name,
        ':client_phone' => $phone,
        ':location' => $location,
        ':gov' => $gov,
        ':area' => $area,
        ':quantity' => $quantity
      ]);
      echo json_encode(['msg' => 'ordered']);
    } else if ($type === 'remvoeProduct') {
        foreach ($decoded['data'] as $p) {
            $id   = $p['id'];
            $temp = $p['temp'];   // e.g. "./upload/foo.jpg"
            $imgs = $p['imgs'];   // array of "./upload/bar.jpg", etc.

            // 1) Remove DB rows
            DBConnection("DELETE FROM imgs WHERE temp_id = :id",      [':id' => $id]);
            DBConnection("DELETE FROM templates WHERE id = :id",      [':id' => $id]);

            // 2) Delete main image file
            $mainPath = $uploadDir . basename($temp);
            if (file_exists($mainPath)) {
                unlink($mainPath);
            }

            // 3) Delete each gallery image file
            foreach ($imgs as $img) {
                $imgPath = $uploadDir . basename($img);
                if (file_exists($imgPath)) {
                    unlink($imgPath);
                }
            }
        }

        echo json_encode(['status' => 'success', 'msg' => 'removed']);
    } else if ($type === 'editUpdate') {
      $id = $decoded['id'];
      $name = $decoded['name'];
      $price = $decoded['price'];
      $infos = $decoded['infos'];
      $sql = "
        UPDATE templates
        SET name = :name, price = :price, infos = :infos
        WHERE id = :id
      ";
      DBConnection($sql, [
        ':id' => $id,
        ':name' => $name,
        ':price' => $price,
        ':infos' => $infos
      ]);
      echo json_encode(['msg' => 'updated']);
    } else if ($type === 'getTypes') {
      $sql = "SELECT * FROM products_types";
      echo json_encode(DBConnection($sql), JSON_UNESCAPED_UNICODE);
    } else if ($type === 'addCategory') {
        $name = $_POST['name'] ?? '';
        $file = $_FILES['temp'] ?? null;
        $catImg = '';
        if ($file && $file['error'] === 0) {
            $uname = 'category_' . uniqid() . '_' . basename($file['name']);
            if (move_uploaded_file($file['tmp_name'], $uploadDir . $uname)) {
                $catImg = './upload/' . $uname;
            }
        }
        DBConnection(
            "INSERT INTO products_types (name, temp)
            VALUES (:name, :temp)",
            [':name' => $name, ':temp' => $catImg]
        );
        echo json_encode(['status' => 'success', 'msg' => 'added']);
    } else if ($type === 'cateDel') {
        $id = $decoded['id'] ?? null;
        if (!$id) {
            echo json_encode(['error' => 'No category ID']);
            exit;
        }

        // 1) Fetch category info
        $res   = DBConnection("SELECT name, temp FROM products_types WHERE id = :id", [':id' => $id]);
        $cat   = $res[0] ?? [];
        $cTemp = $cat['temp'] ?? null;    // e.g. "./upload/cat123.jpg"
        $name  = $cat['name'];

        // 2) Delete category image
        if ($cTemp) {
            $catImgPath = $uploadDir . basename($cTemp);
            if (file_exists($catImgPath)) {
                unlink($catImgPath);
            }
        }

        // 3) Delete category row
        DBConnection("DELETE FROM products_types WHERE id = :id", [':id' => $id]);

        // 4) Fetch all templates of this type
        $tpls = DBConnection(
            "SELECT id, img FROM templates WHERE product_type = :type",
            [':type' => $name]
        );

        foreach ($tpls as $t) {
            $tid  = $t['id'];
            $img0 = $t['img'];  // e.g. "./upload/foo.jpg"

            // 5) Delete template main image
            $tplImgPath = $uploadDir . basename($img0);
            if (file_exists($tplImgPath)) {
                unlink($tplImgPath);
            }

            // 6) Delete gallery images for this template
            $gImgs = DBConnection("SELECT img FROM imgs WHERE temp_id = :tid", [':tid' => $tid]);
            foreach ($gImgs as $gi) {
                $gImgPath = $uploadDir . basename($gi['img']);
                if (file_exists($gImgPath)) {
                    unlink($gImgPath);
                }
            }

            // 7) Delete DB entries for this template
            DBConnection("DELETE FROM imgs WHERE temp_id = :tid",   [':tid' => $tid]);
            DBConnection("DELETE FROM templates WHERE id = :tid",   [':tid' => $tid]);
            echo json_encode(['msg' => 'deleted']);
        }
    } else {
      echo json_encode($decoded, JSON_UNESCAPED_UNICODE);
    }
  }
  function DBConnection($sql, $bindings=[]) {
    $host = "sql201.infinityfree.com";
    $dbname = "if0_38811111_zoksh_store";
    $username = "if0_38811111";
    $password = "DU9OhrTVWyOY";

    try {
      $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
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
