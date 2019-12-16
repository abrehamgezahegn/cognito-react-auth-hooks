import { useState } from "react";
import { useHistory } from "react-router-dom";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import useUserPool from "./useUserPool";

const useLogin = props => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userPool = useUserPool(
    "REACT_APP_AWS_COGNITO_USER_POOL_ID",
    "REACT_APP_AWS_COGNITO_CLIENT_ID"
  );

  const { push } = useHistory();

  const { onDone, errorRedirectPath } = props;

  const login = data => {
    setLoading(true);
    setErrorMessage("");
    try {
      let authenticationDetails = new AuthenticationDetails({
        Username: data.email,
        Password: data.password
      });
      let userData = {
        Username: data.email,
        Pool: userPool
      };
      let cognitoUser = new CognitoUser(userData);
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async result => {
          setLoading(false);
          setErrorMessage("");
          onDone();
        },
        onFailure: err => {
          setLoading(false);
          if (err.code === "PasswordResetRequiredException") {
            return push(errorRedirectPath, {
              existingUser: true,
              email: data.email
            });
          }
          setErrorMessage("Wrong Email or Password");
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return { login, errorMessage, loading };
};

export default useLogin;
