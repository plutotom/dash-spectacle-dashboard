import axios from "axios";
import urls from "./urls";

export async function getGeoLocation(
  location = "213 thomas lincoln Il 62656 united states"
) {
  // https://api.geoapify.com/v1/geocode/search?text=38%20Upper%20Montagu%20Street%2C%20Westminster%20W1H%201LJ%2C%20United%20Kingdom&apiKey=65852197164442b5b2322b285de696b1
  const url = urls.getGeoLocation + "json?address=" + location;
  const res = await axios.get(url);
  return res;
}

const fetchTool = async () => {
  const baseConfig = {
    url: "",
  };

  let getGeoLocation = (location) => {
    if location return true 
    return false;
  };
};
