import React from "react";
import { ButtonBlue } from "../components/ui/ButtonBlue";

const RegistrationPagesStepOne = () => {
  return (
    <div className="stepone">
      <h1 className="stepone__text">Registration</h1>
      <div className="stepone__button">
        <ButtonBlue
          textButton="Telephone"
          linkButton="registrationStep2Telephone"
        />
        <p className="stepone__button-seperator">OR</p>
        <ButtonBlue textButton="Email" linkButton="registrationStep2Email" />
      </div>
    </div>
  );
};

export default RegistrationPagesStepOne;
