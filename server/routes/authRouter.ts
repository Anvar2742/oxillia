import { Router } from "express";
import { login, logout, refresh, signup } from "../controller/authController";
import passport from "passport";
import passportConfig from "../config/passportConfig";
import { onboard } from "../controller/onboardController";

// Passport config
passportConfig(passport);

export const authRouter = Router();
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

// refresh token to get new access tokens
authRouter.get("/refresh", refresh);

// use passport.authenticate('jwt') to protect routes
// Onboarding
authRouter.post(
    "/onboarding",
    passport.authenticate("jwt", { session: false }),
    onboard
);

export default authRouter;
