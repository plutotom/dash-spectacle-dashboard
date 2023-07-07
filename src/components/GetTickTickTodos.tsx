import React, { useState } from "react";
import axios, { AxiosResponse } from "axios";

interface AccessTokenResponse {
  access_token: string;
}

const GetTickTickTodos: React.FC = () => {
  const [todos, setTodos] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  const clientId = process.env.REACT_APP_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
  const redirectUri = process.env.REACT_APP_REDIRECT_URI;

  const handleAuthentication = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      try {
        const response: AxiosResponse<AccessTokenResponse> = await axios.post(
          "https://ticktick.com/oauth/token",
          {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
          }
        );
        const { access_token } = response.data;
        setAccessToken(access_token);
        fetchTodos(access_token);
      } catch (error) {
        console.error("Error obtaining access token:", error);
      }
    }
  };

  const fetchTodos = async (token: string) => {
    try {
      const response: AxiosResponse<any> = await axios.get(
        "https://api.ticktick.com/api/v2/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleLogin = () => {
    const scopes = "tasks:write tasks:read";
    const authUrl = `https://ticktick.com/oauth/authorize?scope=${scopes}&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = authUrl;
  };

  if (!accessToken) {
    handleAuthentication();
  }

  return (
    <div>
      <h1>Todo List</h1>
      {!accessToken ? (
        <button onClick={handleLogin}>Login with TickTick</button>
      ) : (
        <>
          {todos.map((todo: any) => (
            <div key={todo.id}>
              <h3>{todo.title}</h3>
              <p>{todo.content}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default GetTickTickTodos;
