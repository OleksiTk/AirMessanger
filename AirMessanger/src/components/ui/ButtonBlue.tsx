import React, { useEffect } from "react";
import "../../style/ui/buttonBlue.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const ButtonBlue = ({
  textButton,
  linkButton,
}: {
  textButton: string;
  linkButton: string;
}) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(`/${linkButton}`)} className="button-blue">
      <p className="button-blue__text">{textButton}</p>
    </button>
  );
};
