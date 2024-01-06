import React, { useState, useEffect } from "react";
import "../../styles/notion.css";
import { listUsers } from "../../shared/api/noiton";
export default function NotionPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    listUsers().then((res) => {
      console.log(res);
      setUsers(res);
    });
  }, []);

  return (
    <>
      <p>here is text</p>
    </>
  );
}
