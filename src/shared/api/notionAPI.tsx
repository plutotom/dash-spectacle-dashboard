const HONO_BASE_URL = process.env.REACT_APP_HONO_BASE_URL || "";
const HONO_BASE_URL_DEV = process.env.REACT_APP_HONO_BASE_URL_DEV || "";
const REACT_APP_MODE = process.env.REACT_APP_MODE || "";

const listUsers = async (): Promise<any> => {
  let url: string = "";
  if (REACT_APP_MODE === "dev") {
    url = HONO_BASE_URL_DEV + "notion/users";
  } else {
    url = HONO_BASE_URL + "notion/users";
  }

  console.log(url);

  return await fetch("/api/notion/users", {
    headers: {
      accept: "application/json",
      "User-agent": "learning app",
    },
  })
    .then((res: Response) => res.json())
    .catch((err) => {
      console.log(err);
    });
};

const getDashboard = async (): Promise<any> => {
  let url: string = "api/notion/dashboard-todos";

  console.log(url);

  return await fetch(url).then((res: Response) => res.json());
};

export { listUsers, getDashboard };
