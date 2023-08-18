const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  let { userid } = req.query;
  if (!userid) userid = req.body.userid;
  const token = req.cookies?.access_token;
  jwt.verify(token, process.env.JWT_KEY, (err, userInfo) => {
    if (err) res.status(400).json({ message: "Token not valid" });
    if (userInfo?.id != userid) {
      return res.status(401).json({ message: "Not authorized" });
    }
    next();
  });
}

module.exports = authenticate;
