let searchValue = ''
// Function to format date
// export const formatDate = async (unixTimestamp, type) => {
const formatDate = (unixTimestamp, type) => {
  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDaysShortened = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsShortened = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const date = new Date(unixTimestamp * 1000);
  const dayOfMonth = date.getDate();
  const monthIndex = date.getMonth();
  const dayOfWeekIndex = date.getDay();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const formattedDate = `${dayOfMonth} ${months[monthIndex]} ${weekDays[dayOfWeekIndex]}`;
  const formattedDateShortened = `${dayOfMonth} ${monthsShortened[monthIndex]} ${weekDaysShortened[dayOfWeekIndex]}`;

  if (type === "day") {
    return weekDays[dayOfWeekIndex];
  } else if (type === "hour") {
    return `${hours}:${minutes}`;
  } else if (type === "short") {
    return formattedDateShortened;
  } else {
    return formattedDate;
  }
};

// Unit Converter
const mpsToKmh = (mps) => {
  return `${Math.round(mps * 3.6)} km/h`;
};

const metersToKm = (meters) => {
  return `${meters / 1000} km`;
};

const capitalize = (str) => {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
};
const roundDegree = (degree) => {
  if ((Math.round(degree * 10) / 10) % 1 === 0) {
    return `${(Math.round(degree * 10) / 10).toFixed(1)}°C`;
  } else {
    return `${Math.round(degree * 10) / 10}°C`;
  }
};

const weatherApi = {
  API_KEY: `066bf6b020e0f48f3eb3216d3724be08`,
  baseUrl: `https://api.openweathermap.org/data/2.5/`,
};
const locationData = {};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation);
  } else {
    abc.innerHTML = "Geolocation is not supported by this browser.";
  }
};

const showLocation = (location) => {
  locationData.latitude = location.coords.latitude;
  locationData.longitude = location.coords.longitude;
  getCurrentWeather(locationData);
};

const getCurrentWeather = (locationData) => {
  const { latitude, longitude } = locationData;
  let apiUrl;

  if (latitude && longitude) {
    apiUrl = `${weatherApi.baseUrl}weather?lat=${latitude}&lon=${longitude}&appid=${weatherApi.API_KEY}&units=metric`;
  } else {
    apiUrl = `${weatherApi.baseUrl}weather?q=${searchValue}&appid=${weatherApi.API_KEY}&units=metric`;
  }

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Sorry, we couldn't find ${locationData}. Please double-check the spelling and try again.`
          );
        } else {
          throw new Error(
            "Oops! We're having trouble getting the latest weather information right now. Please try again later or contact support if the problem persists."
          );
        }
      }
      return response.json();
    })
    .then((data) => {
      // Call displayWeather inside this .then() block
      console.log(data)
      displayWeather(data);
      createWeatherCards();
      weatherForecastData(data);
      changeBgImage(data);
    })

    .catch((error) => {
      console.error("There was a problem fetching the weather data:", error);
      throw error; // Rethrow the error for further handling if necessary
    });
};

const displayWeather = (data) => {
  const { main, weather, name, dt, sys, wind, visibility } = data;
  const { temp, humidity, pressure } = main;
  const { sunrise, sunset } = sys;
  const { speed } = wind;
  const { description, icon } = weather[0];
  console.log(`temp ${temp}`)

  const currentWeatherIcon = document.querySelector(".current-weather-icon");
  currentWeatherIcon.src = `http://openweathermap.org/img/w/${icon}.png`;
  const currentWeatherTemperature = document.querySelector(
    ".current-weather-temperature"
  );
  currentWeatherTemperature.textContent = `${roundDegree(temp)}`;
  // currentWeatherTemperature.textContent = `${temp} °C`;
  const currentWeatherDescription = document.querySelector(
    ".current-weather-description"
  );
  currentWeatherDescription.textContent = `${weather[0].main}`;
  // currentWeatherDescription.textContent = `${weather[0].description}`;
  const currentLocation = document.querySelector(".current-location");
  currentLocation.textContent = ` ${data.name}`;
  const currentDate = document.querySelector(".current-date");
  currentDate.textContent = `${formatDate(dt)}`;

  const windSpeedValue = document.querySelector(".wind-speed-value");
  const pressureValue = document.querySelector(".pressure-value");
  const sunriseValue = document.querySelector(".sunrise-value");
  const humidityValue = document.querySelector(".humidity-value");
  const visibilityValue = document.querySelector(".visibility-value");
  const sunsetValue = document.querySelector(".sunset-value");

  windSpeedValue.innerHTML = mpsToKmh(speed);
  pressureValue.innerHTML = `${pressure} hPa`;
  sunriseValue.innerHTML = formatDate(sunrise, "hour");
  humidityValue.innerHTML = `${main.humidity}%`;
  visibilityValue.innerHTML = metersToKm(data.visibility);
  sunsetValue.innerHTML = formatDate(sunset, "hour");
};
const hourlyWeatherForecastSection = document.querySelector(
  ".hourly-weather-forecast-section"
);
const createWeatherCards = () => {
  // const hourlyWeatherForecastSection = document.querySelector(
  //   ".hourly-weather-forecast-section"
  // );
  
  // console.log(`hourlyWeatherForecastSection ${hourlyWeatherForecastSection.length}`)
  // hourlyWeatherForecastSection.removeChild
  for (let index = 0; index <= 4; index++) {
    // console.log(index)
    const hourlyWeatherForecastCard = document.createElement("div");
    hourlyWeatherForecastCard.classList.add("hourly-weather-forecast-card");
    const hourlyWeatherForecastDateTime = document.createElement("div");
    hourlyWeatherForecastDateTime.classList.add(
      "hourly-weather-forecast-date-time"
    );
    const hourlyWeatherForecastDate = document.createElement("div");
    hourlyWeatherForecastDate.classList.add(
      "hourly-weather-forecast-date",
      "loading",
      "dynamic-data"
    );
    hourlyWeatherForecastDate.innerHTML = "&nbsp;";
    const hourlyWeatherForecastTime = document.createElement("div");
    hourlyWeatherForecastTime.classList.add(
      "hourly-weather-forecast-time",
      "loading",
      "dynamic-data"
    );
    hourlyWeatherForecastTime.innerHTML = "&nbsp;";
    const hourlyWeatherForecastTemperature = document.createElement("div");
    hourlyWeatherForecastTemperature.classList.add(
      "hourly-weather-forecast-temperature",
      "loading",
      "dynamic-data"
    );
    hourlyWeatherForecastTemperature.innerHTML = "&emsp;&emsp;";
    hourlyWeatherForecastDateTime.appendChild(hourlyWeatherForecastDate);
    hourlyWeatherForecastDateTime.appendChild(hourlyWeatherForecastTime);
    hourlyWeatherForecastCard.appendChild(hourlyWeatherForecastDateTime);
    hourlyWeatherForecastCard.appendChild(hourlyWeatherForecastTemperature);
    hourlyWeatherForecastSection.appendChild(hourlyWeatherForecastCard);
  }
  const dailyForecastSection = document.querySelector(
    ".daily-forecast-section"
  );
  for (let index = 0; index <= 5; index++) {
    const dailyWeatherForecastCard = document.createElement("div");
    dailyWeatherForecastCard.classList.add("daily-weather-forecast-card");
    const dailyWeatherForecastDateTime = document.createElement("div");
    dailyWeatherForecastDateTime.classList.add(
      "daily-weather-forecast-date-time"
    );
    const dailyWeatherForecastDate = document.createElement("div");
    dailyWeatherForecastDate.classList.add(
      "daily-weather-forecast-date",
      "loading",
      "dynamic-data"
    );
    dailyWeatherForecastDate.innerHTML = "&nbsp;";
    const dailyWeatherForecastTime = document.createElement("div");
    dailyWeatherForecastTime.classList.add(
      "daily-weather-forecast-time",
      "loading",
      "dynamic-data"
    );
    dailyWeatherForecastTime.innerHTML = "&nbsp;";
    const dailyWeatherForecastIcon = document.createElement("img");
    dailyWeatherForecastIcon.classList.add(
      "daily-weather-forecast-icon",
      "loading",
      "dynamic-data"
    );
    const dailyForecastWeatherDetails = document.createElement("div");
    dailyForecastWeatherDetails.classList.add("daily-forecast-weather-details");
    const dailyWeatherForecastTemperature = document.createElement("div");
    dailyWeatherForecastTemperature.classList.add(
      "daily-weather-forecast-temperature",
      "loading",
      "dynamic-data"
    );
    dailyWeatherForecastTemperature.innerHTML = "&emsp;&emsp;";
    const dailyWeatherForecastDescription = document.createElement("div");
    dailyWeatherForecastDescription.classList.add(
      "daily-weather-forecast-description",
      "loading",
      "dynamic-data"
    );
    dailyWeatherForecastDescription.innerHTML = "&emsp;&emsp;";
    dailyWeatherForecastDateTime.appendChild(dailyWeatherForecastDate);
    dailyWeatherForecastDateTime.appendChild(dailyWeatherForecastTime);
    dailyWeatherForecastCard.appendChild(dailyWeatherForecastDateTime);
    dailyWeatherForecastCard.appendChild(dailyWeatherForecastIcon);
    dailyForecastWeatherDetails.appendChild(dailyWeatherForecastTemperature);
    dailyForecastWeatherDetails.appendChild(dailyWeatherForecastDescription);
    dailyWeatherForecastCard.appendChild(dailyForecastWeatherDetails);
    // dailyForecastSection.appendChild(dailyWeatherForecastCard);
  }
};
// Hourly forecast display data
const weatherForecastData = (weatherData) => {
  const { latitude, longitude } = locationData;
  let apiUrl;
  if (latitude && longitude) {
    apiUrl = `${weatherApi.baseUrl}forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApi.API_KEY}&units=metric`;
  } else {
    apiUrl = `${weatherApi.baseUrl}forecast?q=${data}&appid=${weatherApi.API_KEY}&units=metric`;
  }
  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Sorry, we couldn't find ${locationData}. Please double-check the spelling and try again.`
          );
        } else {
          throw new Error(
            "Oops! We're having trouble getting the latest weather information right now. Please try again later or contact support if the problem persists."
          );
        }
      }
      return response.json();
    })
    .then((data) => {
      displayWeatherForecastData(data);
    })

    .catch((error) => {
      console.error("There was a problem fetching the weather data:", error);
      throw error; // Rethrow the error for further handling if necessary
    });
};

const displayWeatherForecastData = (data) => {
  const hourlyWeatherForecastDate = document.querySelectorAll(
    ".hourly-weather-forecast-date"
  );
  const hourlyWeatherForecastTime = document.querySelectorAll(
    ".hourly-weather-forecast-time"
  );
  const hourlyWeatherForecastTemperature = document.querySelectorAll(
    ".hourly-weather-forecast-temperature"
  );
  const { city, list } = data;
  for (let index = 0; index < 5; index++) {
    // console.log(data.list[index].dt);
    // console.log(data.list[index].weather[0].icon);
    // console.log(data.list[index].weather[0].main);
    // console.log(data.list[index].main.temp);
  }

  for (let index = 0; index < 5; index++) {
    if (hourlyWeatherForecastDate[index]) {
      hourlyWeatherForecastDate[index].innerHTML = formatDate(
        list[index].dt,
        "day"
      );
    }
    if (hourlyWeatherForecastTime[index]) {
      hourlyWeatherForecastTime[index].innerHTML = formatDate(
        list[index].dt,
        "hour"
      );
    }
    if (hourlyWeatherForecastTemperature[index]) {
      hourlyWeatherForecastTemperature[index].innerHTML = roundDegree(
        list[index].main.temp
      );
    }
  }
  for (let index = 0; index < 5; index++) {
    // dailyWeatherForecastDate[index].innerHTML = formatDate(data.list[index].dt, "short");
    dailyWeatherForecastTime[index].innerHTML = formatDate(
      data.list[index].dt,
      "hour"
    );
    dailyWeatherForecastIcon[
      index
    ].src = `src/images/static/${data.list[index].weather[0].icon}.svg`;
    dailyWeatherForecastTemperature[index].innerHTML = roundDegree(
      data.list[index].main.temp
    );
    dailyWeatherForecastDescription[index].innerHTML =
      data.list[index].weather[0].main;
  }
};

// // Description
// const changeBgImage = (data) => {
//   // console.log(data.weather[0].description);
//   const container = document.querySelector(".main-container");

//   if (data.weather[0].description == "Clear") {
//     container.style.backgroundImage = "url('src/images/clear.jpg')";
//     // /img/
//   } else if (data.weather[0].description == "Clouds") {
//     container.style.backgroundImage = "url('src/images/clouds.jpg')";
//   } else if (data.weather[0].description == "haze") {
//     // container.style.backgroundImage = "url('src/images/haze.jpg')";
//     // container.style.backgroundImage = "url('src/images/clear.jpg')";
//     container.style.backgroundImage = "url('src/images/clear.jpg')";
//     // console.log("kugbki");
//   } else if (data.weather[0].description == "Rain") {
//     container.style.backgroundImage = "url('src/images/rain.jpg')";
//   } else if (data.weather[0].description == "Snow") {
//     container.style.backgroundImage = "url('src/images/snow.jpg')";
//   } else if (data.weather[0].description == "Thunderstorm") {
//     container.style.backgroundImage = "url('src/images/thunderstorm.jpg')";
//   } else if (data.weather[0].description == "Mist") {
//     container.style.backgroundImage = "url('src/images/mist.jpg')";
//   } else if (data.weather[0].description == "Drizzle") {
//     container.style.backgroundImage = "url('src/images/rain.jpg')";
//   }
// };

// Main
const changeBgImage = (data) => {
  // console.log(data.weather[0].description);
  const container = document.querySelector(".main-container");
  // console.log(container.style.backgroundImage)
  // console.log(document.body.style.backgroundImage)
  // alert(document.body.style.backgroundImage)

  if (data.weather[0].main == "Clear") {
    // container.style.backgroundImage = "url('src/images/clear.jpg')";
    document.body.style.backgroundImage = "url('src/images/clear.jpg')";
    // /img/
  } else if (data.weather[0].main == "Clouds") {
    // container.style.backgroundImage = "url('src/images/clouds.jpg')";
    document.body.style.backgroundImage = "url('src/images/cloud.jpg')";
    
  } else if (data.weather[0].main == "haze") {
    // container.style.backgroundImage = "url('src/images/haze.jpg')";
    document.body.style.backgroundImage = "url('src/images/haze.jpg')";
    // container.style.backgroundImage = "url('src/images/clear.jpg')";
    // container.style.backgroundImage = "url('src/images/clear.jpg')";
    // console.log("kugbki");
  } else if (data.weather[0].main == "Rain") {
    // container.style.backgroundImage = "url('src/images/rain.jpg')";
    document.body.style.backgroundImage = "url('src/images/rain.jpg')";
  } else if (data.weather[0].main == "Snow") {
    // container.style.backgroundImage = "url('src/images/snow.jpg')";
    document.body.style.backgroundImage = "url('src/images/snow.jpg')";
  } else if (data.weather[0].main == "Thunderstorm") {
    // container.style.backgroundImage = "url('src/images/thunderstorm.jpg')";
    // container.style.backgroundImage = "url('src/images/thunderstorm.jpg')";
  } else if (data.weather[0].main == "Mist") {
    // container.style.backgroundImage = "url('src/images/mist.jpg')";
    document.body.style.backgroundImage = "url('src/images/mist.jpg')";
  } else if (data.weather[0].main == "Drizzle") {
    // container.style.backgroundImage = "url('src/images/rain.jpg')";
    document.body.style.backgroundImage = "url('src/images/rain.jpg')";
  }
};

// console.log(`hourlyWeatherForecastSection ${JSON.stringify(hourlyWeatherForecastSection.childNodes)}`)
  const searchInput = document.querySelector(".search-box-input");
  searchInput.addEventListener("keypress", (e)=>{
    if (e.keyCode == 13){
      while (hourlyWeatherForecastSection.hasChildNodes()) {
        hourlyWeatherForecastSection.removeChild(hourlyWeatherForecastSection.firstChild);
      }
      searchValue = searchInput.value
      // console.log(searchValue);
      // hourlyWeatherForecastSection
  console.log(`hourlyWeatherForecastSection ${JSON.stringify(hourlyWeatherForecastSection.childNodes)}`)
      // console.log(`length ${hourlyWeatherForecastSection.childNodes.length}`)
    
      // for (let index = 0; index < hourlyWeatherForecastSection.length; index++) {
      //   const element = hourlyWeatherForecastSection[index];
      //   console.log(element)
        
      // }
      // console.log(`length ${hourlyWeatherForecastSection.length}`)
    getCurrentWeather(searchValue)
    }
  })

window.onload = getLocation;