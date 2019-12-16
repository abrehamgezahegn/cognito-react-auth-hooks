import useUserPool from "./useUserPool";
import { useHistory } from "react-router-dom";
const useLogout = ({ onDone, redirectPath }) => {
  const userPool = useUserPool(
    "REACT_APP_AWS_COGNITO_USER_POOL_ID",
    "REACT_APP_AWS_COGNITO_CLIENT_ID"
  );
  const history = useHistory();

  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    cognitoUser.getSession(async (err, session) => {
      if (err) {
        return console.log(err);
      }

      await cognitoUser.signOut();
      await onDone();
      history.push(redirectPath);
    });
  }
};

export default useLogout;
