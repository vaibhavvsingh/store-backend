import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY;

function authenticate(req: Request, res: Response, next: NextFunction) {
  let { userid } = req.query;
  if (!userid) userid = req.body.userid;
  const token = req.cookies?.access_token;
  jwt.verify(token, JWT_KEY as string, (err:any, userInfo:any):void|Response => {
    if (err) res.status(400).json({ message: "Token not valid" });
    if (userInfo?.id != userid) {
      return res.status(401).json({ message: "Not authorized" });
    }
    next();
  });
}

export default authenticate;
