import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { notification } from "antd";
import { CognitoUser } from "amazon-cognito-identity-js";
import useUserPool from "./useUserPool";

const useNewPassword = ({ redirectPath }) => {
  const userPool = useUserPool(
    "REACT_APP_AWS_COGNITO_USER_POOL_ID",
    "REACT_APP_AWS_COGNITO_CLIENT_ID"
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { email, resetCode } = useParams();
  const history = useHistory();

  const forgotPassword = async data => {
    if (data.newPassword !== data.confirmPassword)
      return setErrorMessage("Passwords don't match!");

    setLoading(true);
    let userData = {
      Username: email,
      Pool: userPool
    };
    let cognitoUser = new CognitoUser(userData);
    await cognitoUser.confirmPassword(resetCode, data.newPassword, {
      onSuccess() {
        setLoading(false);
        notification.success({ message: "Password update successful." });
        return history.push(redirectPath);
      },
      onFailure(err) {
        setLoading(false);
        notification.error({ message: "Password update failed." });
        console.log("Password not confirmed!");
      }
    });
  };

  return { loading, errorMessage, forgotPassword };
};

export default useNewPassword;
