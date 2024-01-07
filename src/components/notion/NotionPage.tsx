import React, { useState, useEffect } from "react";
import "../../styles/notion.css";
import { getDashboard, listUsers } from "../../shared/api/notionAPI";
export default function NotionPage() {
  const [users, setUsers] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [dashboardTodos, setDashboardTodos] = useState([]);

  useEffect(() => {
    listUsers().then((res) => {
      console.log(res);
    });
    getDashboard().then((res) => {
      // console.log(res);
      // res is a object.
      let todos: any = [];
      todos = res.results.filter((item: any) => item.type === "to_do");
      console.log(todos);

      setDashboardTodos(todos);
    });
  }, []);

  return (
    <>
      <p>here is text</p>

      {dashboardTodos.length > 0 &&
        dashboardTodos.map((item: any) => {
          return (
            <div key={item.id} className="notion-todo">
              <p>{item.to_do.rich_text[0].plain_text}</p>
            </div>
          );
        })}
    </>
  );
}
