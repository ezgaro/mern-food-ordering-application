import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/user";

declare global {
  namespace Express {
    interface Request {
      auth0Id: string;
      userId: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = auth(
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer ")) {
      return res.status(401);
    }
    // Bearer ianxoiaxooxoamoxsaox
    const token = authorization.split(" ")[1];

    try {
      const decoded = jwt.decode(token) as jwt.JwtPayload; // decoded is now a JwtPayload
      const auth0Id = decoded.sub(); // sub is the Auth0 user ID

      const user = await User.findOne({ auth0Id });
      if (!user) {
        return res.status(401);
      }

      req.auth0Id = auth0Id;
      req.userId = user._id.toString();
      next();
    } catch (error) {
      return res.status(401);
    }
  }
);
