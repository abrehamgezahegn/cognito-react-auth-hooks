import { useState, useEffect } from "react";
import { notification } from "antd";
import { useLocation } from "react-router-dom";
import { CognitoUser } from "amazon-cognito-identity-js";
import useUserPool from "./useUserPool";

const useResetPassword = () => {
  const userPool = useUserPool(
    "REACT_APP_AWS_COGNITO_USER_POOL_ID",
    "REACT_APP_AWS_COGNITO_CLIENT_ID"
  );

  const location = useLocation();

  const [showClue, setClue] = useState("");
  const [customLabel, setLabel] = useState(
    "Enter your email address below and we'll send you a link to reset your password."
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state) {
      setClue(location.state.existingUser);
    }
  }, [location.state]);

  const sendResetEmail = data => {
    setLoading(true);
    let userData = {
      Username: data.email,
      Pool: userPool
    };
    let cognitoUser = new CognitoUser(userData);
    cognitoUser.forgotPassword({
      onSuccess: data => {
        setLoading(false);
        setLabel(
          "Link has been sent. Please check your email. Or Change your email."
        );
        notification.success({ message: "Email Sent!" });
      },
      onFailure: err => {
        console.log(err);
        notification.error({ message: "Failed to send an email!" });

        setLoading(false);
      }
    });
  };

  return { loading, showClue, customLabel, sendResetEmail };
};

export default useResetPassword;
