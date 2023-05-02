const baseURL = "http://localhost:3000/api/";
const baseGeoLocationUrl = "https://api.geoapify.com/v1/geocode/search?";
const baseWeatherUrl = "https://api.weather.gov/";
const urls = {
  testGet: baseURL + "testGet",
  getGeoLocation: baseURL,
  getWeatherPoints: baseWeatherUrl + "points",
};

export default urls;
