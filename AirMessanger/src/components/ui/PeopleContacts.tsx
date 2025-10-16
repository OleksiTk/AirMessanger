import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import { useNavigate } from "react-router-dom";

function PeopleContacts({ Pages }: { Pages: string }) {
  const [activePage, setActivePage] = useState("");
  useEffect(() => {
    setActivePage(Pages);
  }, [Pages]);
  const navigate = useNavigate();
  return (
    <div className="main__chats">
      <div className="main__chats-input-search">
        <Container maxWidth="sm" sx={{ paddingLeft: 0 }}>
          <SearchInput />
        </Container>
      </div>
      <div
        className="main__chats-groups main-groups"
        onClick={() => navigate("/chats/JHON-Doe")}
      >
        <div className="main-groups__icon">
          <img src="src/assets/Frame.png" alt="avatar" />
          <div className="main-groups__icon-active">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1Z"
                fill="#2CC069"
                stroke="#F7F7FC"
              />
            </svg>
          </div>
        </div>
        <div className="main-groups__information">
          <div className="main-groups__information__name">JHON DOE</div>
          <div className="main-groups__information__lastmessage">
            How is it going?
          </div>
        </div>
        {activePage == "chats" ? (
          <div className="main-groups__notifications main-notifications">
            <div className="main-notifications__days">17/6</div>
            <div className="main-notifications__count">3</div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default PeopleContacts;
