import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if(!token) {
      res.status(403).json({message: "token not passed"});
    }

    const isBlackListed = await redisClient.get(token);

    if(isBlackListed) {
      res.cookies('token', '');
      res.status(403).json({message: "token not passed"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    res.status(403).json({message: "User not authenticated"});
  }
}