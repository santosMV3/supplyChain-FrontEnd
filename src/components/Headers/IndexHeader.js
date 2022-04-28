import React from "react";
import { useHistory } from "react-router-dom";

function IndexHeader() {
  const history = useHistory();
  history.push('/auth/login');
  return (
    <>
    </>
  );
}

export default IndexHeader;
