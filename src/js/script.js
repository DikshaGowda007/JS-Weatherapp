// Function to format date
// export const formatDate = async (unixTimestamp, type) => {
  const formatDate = (unixTimestamp, type)=>{
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
    const monthsShortened = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
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
  }
  
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
      baseUrl: `https://api.openweathermap.org/data/2.5/weather`,
    }
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
        apiUrl = `${weatherApi.baseUrl}?lat=${latitude}&lon=${longitude}&appid=${weatherApi.API_KEY}`;
      } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationData}&appid=${weatherApi.API_KEY}&units=metric`;
      }
    
      return fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error(`Sorry, we couldn't find ${locationData}. Please double-check the spelling and try again.`);
            } else {
              throw new Error(
                "Oops! We're having trouble getting the latest weather information right now. Please try again later or contact support if the problem persists."
              );
            }
          }
          return response.json();
        })
        .then(data => {
          // Call displayWeather inside this .then() block
          displayWeather(data);
        })
        
        .catch(error => {
          console.error('There was a problem fetching the weather data:', error);
          throw error; // Rethrow the error for further handling if necessary
        });
    };
    
    const displayWeather = (data) => {
      const { main, weather, name, dt, sys, wind, visibility } = data;
      const { temp, humidity, pressure } = main;
      const { sunrise, sunset } = sys;
      const { speed } = wind;
      const { description, icon } = weather[0];
      console.log(data)
      // console.log(icon)
  
    
      const currentWeatherIcon = document.querySelector(".current-weather-icon");
       // https://openweathermap.org/img/wn/10d@2x.png
      //  currentWeatherIcon.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      currentWeatherIcon.src = `http://openweathermap.org/img/w/${icon}.png`;
      const currentWeatherTemperature = document.querySelector(".current-weather-temperature");
      currentWeatherTemperature.textContent = `${temp} °C`;
      const currentWeatherDescription = document.querySelector(".current-weather-description");
      currentWeatherDescription.textContent = `${weather[0].description}`;
      const currentLocation = document.querySelector(".current-location");
      currentLocation.textContent = ` ${data.name}`;
      const currentDate = document.querySelector(".current-date");
      // currentDate.textContent = `Date: ${dt}%`;
      currentDate.textContent = `${formatDate(dt)}`;
      // console.log(`${formatDate(dt)}`)
    
      const windSpeedValue = document.querySelector(".wind-speed-value");
      const pressureValue = document.querySelector(".pressure-value");
      const sunriseValue = document.querySelector(".sunrise-value");
      const humidityValue = document.querySelector(".humidity-value");
      const visibilityValue = document.querySelector(".visibility-value");
      const sunsetValue = document.querySelector(".sunset-value");
      
      // currentWeatherIcon.src = `src/img/animated/${data.weather[0].icon}.svg`;
      // currentWeatherTemperature.innerHTML = roundDegree(data.main.temp);
      // currentWeatherDescription.innerHTML = capitalize(data.weather[0].description);
      // currentLocation.innerHTML = data.name;
      // currentDate.innerHTML = formatDate(data.dt);
    
      windSpeedValue.innerHTML = mpsToKmh(speed);
      // windSpeedValue.innerHTML = `${speed}`;
      pressureValue.innerHTML = `${pressure} hPa`;
      sunriseValue.innerHTML = formatDate(sunrise, "hour");
      // sunriseValue.innerHTML = `${sunrise} hour`;
      humidityValue.innerHTML = `${main.humidity}%`;
      // visibilityValue.innerHTML = `${visibility}`;
      visibilityValue.innerHTML = metersToKm(data.visibility);
      sunsetValue.innerHTML = formatDate(sunset, "hour");
      // sunsetValue.innerHTML = `${sunset} hour`;
    };
    window.onload = getLocation;