const jwtHelper = require("../helpers/jwt.helper");

// Mã secretKey này phải được bảo mật tuyệt đối, các bạn có thể lưu vào biến môi trường hoặc file
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "access-token-secret-example";

let isAuth = async (req, res, next) => {
  // Lấy token từ header phía client
  const tokenFromClient = req.headers["x-wfg-token"];
  if (tokenFromClient) {// Nếu tồn tại token
    try {
      // Thực hiện giải mã token xem có hợp lệ hay không?
      const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
      // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
      req.jwtDecoded = decoded;
      // Cho phép req đi tiếp sang controller.
      next();
    } catch (error) {
      // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
      return res.status(401).json({
        message: 'Lỗi xác thực token.....',
      });
    }
  } else {
    // Không tìm thấy token trong request
    return res.status(403).send({
      message: 'Không tìm thấy token.',
    });
  }
}
module.exports = {
  isAuth: isAuth
};