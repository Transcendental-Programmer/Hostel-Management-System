import jwt from 'jsonwebtoken';

export const authorizeWarden = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    if (decodedToken.user.type === "warden") {
      return next();
    } else {
      return res.status(403).json({ error: "only warden can access" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const authorizeStudent = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);
    if (decodedToken.user.type === "student") {
      return next();
    } else {
      return res.status(403).json({ error: "Unauthorized for Student" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export const authorizeComplaintRoute = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWTSECRET);
    return next();
  } catch (err) {
    console.error(err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
