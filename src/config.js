const hostname = window.location.hostname;
const protocol = window.location.protocol;

let api = "";

if (hostname === "localhost") {
  api = "http://localhost/zoksh-store/src/PHP/back.php";
} else if (/^192\.168\.\d+\.\d+$/.test(hostname)) {
  api = `http://${hostname}/zoksh-store/src/PHP/back.php`;
} else {
  api = `${protocol}//${hostname}/back.php`;
}

export default api;
