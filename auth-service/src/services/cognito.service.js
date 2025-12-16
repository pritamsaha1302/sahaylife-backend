import {
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "../config/cognito.js";
import crypto from "crypto";

export const getSecretHash = (email) => {
  const clientId = process.env.COGNITO_CLIENT_ID;
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;

  if (!clientSecret) throw new Error("COGNITO_CLIENT_SECRET is missing");

  return crypto
    .createHmac("SHA256", clientSecret)
    .update(email + clientId)
    .digest("base64");
};

export const signUpUser = async (email, password) => {
  const command = new SignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    SecretHash: getSecretHash(email),
  });

  return cognitoClient.send(command);
};

export const confirmUserOTP = async (email, code) => {
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: code,
    SecretHash: getSecretHash(email),
  });

  return cognitoClient.send(command);
};

export const loginUser = async (email, password) => {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.COGNITO_CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: getSecretHash(email),
    },
  });

  return cognitoClient.send(command);
};
