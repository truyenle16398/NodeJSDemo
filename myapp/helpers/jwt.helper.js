const jwt = require("jsonwebtoken");

let generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
    }
    // Thực hiện ký và tạo token
    jwt.sign(
      {data: userData},
      secretSignature,
      {
        algorithm: "HS256",//thuật toán tạo token
        expiresIn: tokenLife,//thời gian sống của token
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
    });
  });
}


let verifyToken = (token, secretKey) => {//xác thực token có hợp lệ hay ko
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
}

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken,
};