const { Client, LogLevel } = require("@notionhq/client");
const notion_token = process.env.REACT_APP_NOTION_SECRET || "";

// const getNotionClient = async () => {
//   // Initializing a client
//   const notion = new Client({
//     auth: notion_token,
//     logLevel: LogLevel.DEBUG,
//     agent: "https://cors-anywhere.herokuapp.com/",
//   });
//   return notion;
// };

// const listUsers = async () => {
//   const notion = await getNotionClient();
//   console.log(notion);
//   const listUsersResponse = await notion.users.list({});
//   console.log(listUsersResponse);
// };

const listUsers = async () => {
  const notionAccessToken = process.env.NOTION_ACCESS_TOKEN || "";
  const url = "https://api.notion.com/v1/users";

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${notionAccessToken}`,
      "Notion-Version": "2022-06-28",
    },
  });

  if (response.ok) {
    const users = await response.json();
    console.log(users);
    return users;
  } else {
    throw new Error("Failed to fetch users");
  }
};

export { listUsers };
