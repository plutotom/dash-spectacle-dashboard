const { Client, LogLevel } = require("@notionhq/client");
const notion_token = process.env.REACT_APP_NOTION_SECRET || "";
// get the env for the hono base url
const HONO_BASE_URL = process.env.REACT_APP_HONO_BASE_URL || "";
const HONO_BASE_URL_DEV = process.env.REACT_APP_HONO_BASE_URL_DEV || "";
const REACT_APP_MODE = process.env.REACT_APP_MODE || "";

const listUsers = async (): Promise<any> => {
  let url: string = "";
  if (REACT_APP_MODE === "dev") {
    url = HONO_BASE_URL_DEV + "api/notion/users";
  } else {
    url = HONO_BASE_URL + "api/notion/users";
  }

  return await fetch("http://127.0.0.1:5005/notion/users").then(
    (res: Response) => res.json()
  );
};

export { listUsers };
