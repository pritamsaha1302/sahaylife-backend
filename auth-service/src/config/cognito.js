import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
console.log("AWS_REGION:", process.env.AWS_REGION);
export const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});
