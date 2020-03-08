import jsonp from "jsonp";
import { message } from "antd";
export const reqWeather = city => {
  return new Promise((resolve, reject) => {
    const url = `https://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    jsonp(url, {}, (err, data) => {
      if (!err) {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0];
        resolve({ dayPictureUrl, weather });
      } else {
        message.error("获取天气失败");
      }
    });
  });
};
