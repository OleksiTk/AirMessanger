import React, { useEffect, useState } from "react";
import "../../style/pages/header.css";
function Header({ Pages }: { Pages: string }) {
  useEffect(() => {
    setActivePage(Pages);
    handleChangePage(Pages);
  }, [Pages]);
  const [activePage, setActivePage] = useState("");
  const [whatContent, setWhatContent] = useState("");
  function handleChangePage(page: string) {
    if (page == "chats") {
      setWhatContent("Chats");
    } else if (page == "contacts") {
      setWhatContent("Contacts");
    } else {
      setWhatContent("More");
    }
  }

  return (
    <header className="header">
      <div className="header__text">{whatContent}</div>
      <div className="header__add-chats">
        {activePage == "chats" ? (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 10H17V7H14V5H17V2H19V5H22V7H19V10Z" fill="#F7F7FC" />
            <path
              d="M21 12H19V15H8.334C7.90107 14.9988 7.47964 15.1393 7.134 15.4L5 17V5H12V3H5C3.89543 3 3 3.89543 3 5V21L7.8 17.4C8.14582 17.1396 8.56713 16.9992 9 17H19C20.1046 17 21 16.1046 21 15V12Z"
              fill="#F7F7FC"
            />
          </svg>
        ) : (
          <div>
            {whatContent != "More" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 13V19H11V13H5V11H11V5H13V11H19V13H13Z"
                  fill="#F7F7FC"
                />
              </svg>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
