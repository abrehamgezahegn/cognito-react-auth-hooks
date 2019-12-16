import { CognitoUserPool } from "amazon-cognito-identity-js";

const useUserPool = (poolId, clientId) => {
  const poolData = {
    UserPoolId: process.env[poolId],
    ClientId: process.env[clientId]
  };

  const userPool = new CognitoUserPool(poolData);
  return userPool;
};

export default useUserPool;
