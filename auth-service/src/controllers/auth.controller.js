import { pool } from "../config/database.js";
import {
  signUpUser,
  confirmUserOTP,
  loginUser,
} from "../services/cognito.service.js";

export const signup = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length) {
      return res.status(400).json({ message: "User already registered." });
    }

    const cognitoRes = await signUpUser(email, password);
    const cognitoId = cognitoRes.UserSub;

    const user = await pool.query(
      `INSERT INTO users (cognito_id, email, full_name, is_verified)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [cognitoId, email, full_name, false]
    );

    res.status(201).json({
      message: "Signup successful. Please verify OTP sent to your email.",
      user: user.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, code } = req.body;

    await confirmUserOTP(email, code);

    await pool.query("UPDATE users SET is_verified = true WHERE email = $1", [
      email,
    ]);

    res.status(200).json({ message: "OTP verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "OTP verification failed",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND is_verified = true",
      [email]
    );

    if (!userResult.rows.length) {
      return res.status(401).json({
        message: "User not registered or not verified.",
      });
    }

    const data = await loginUser(email, password);
    const { AccessToken, RefreshToken, IdToken } = data.AuthenticationResult;

    res.status(200).json({
      message: "Login successful",
      accessToken: AccessToken,
      refreshToken: RefreshToken,
      idToken: IdToken,
      user: userResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      message: "Invalid login credentials",
      error: err.message,
    });
  }
};
