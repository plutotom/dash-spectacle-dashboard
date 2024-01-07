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

const getDashboard = async (): Promise<any> => {
  let url: string = "";
  if (REACT_APP_MODE === "dev") {
    url = HONO_BASE_URL_DEV + "api/notion/dashboard";
  } else {
    url = HONO_BASE_URL + "api/notion/dashboard";
  }
  console.log(url);

  return await fetch("http://127.0.0.1:5005/notion/dashboard").then(
    (res: Response) => res.json()
  );
};

export { listUsers, getDashboard };
