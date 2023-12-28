import React, { useState, useEffect } from "react";
import "../../styles/notion.css";
import { listUsers } from "../../shared/api/noiton";
export default function NotionPage() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    listUsers().then((users: any) => {
      setUsers(users);
    });
  }, []);

  return (
    <>
      <p>here is text</p>
    </>
  );
}
