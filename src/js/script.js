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
      baseUrl: `https://api.openweathermap.org/data/2.5/`,
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
      // weatherForecastData(locationData);
    };
    
    const getCurrentWeather = (locationData) => {
      const { latitude, longitude } = locationData;
      let apiUrl;
    
      if (latitude && longitude) {
        apiUrl = `${weatherApi.baseUrl}weather?lat=${latitude}&lon=${longitude}&appid=${weatherApi.API_KEY}`;
      } else {
        apiUrl = `${weatherApi.baseUrl}weather?q=${locationData}&appid=${weatherApi.API_KEY}&units=metric`;
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
          createHourlyCards()
          weatherForecastData(data);
          changeBgImage(data)
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
      // console.log(data)
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
      // weatherForecastData(data)
    };
  
    // Create Hourly forecast display cards
    const createHourlyCards = ()=>{
      
      const hourlyWeatherForecastSection = document.querySelector(".hourly-weather-forecast-section");
      // console.log(hourlyWeatherForecastSection)
      for (let index = 0; index < 5; index++) {
        const hourlyWeatherForecastCard = document.createElement("div");
        hourlyWeatherForecastCard.classList.add("hourly-weather-forecast-card");
    
        const hourlyWeatherForecastDateTime = document.createElement("div");
        hourlyWeatherForecastDateTime.classList.add("hourly-weather-forecast-date-time");
    
        const hourlyWeatherForecastDate = document.createElement("div");
        hourlyWeatherForecastDate.classList.add("hourly-weather-forecast-date", "loading", "dynamic-data");
        hourlyWeatherForecastDate.innerHTML = "&nbsp;";
    
        const hourlyWeatherForecastTime = document.createElement("div");
        hourlyWeatherForecastTime.classList.add("hourly-weather-forecast-time", "loading", "dynamic-data");
        hourlyWeatherForecastTime.innerHTML = "&nbsp;";
    
        const hourlyWeatherForecastTemperature = document.createElement("div");
        hourlyWeatherForecastTemperature.classList.add("hourly-weather-forecast-temperature", "loading", "dynamic-data");
        hourlyWeatherForecastTemperature.innerHTML = "&emsp;&emsp;";
    
        hourlyWeatherForecastDateTime.appendChild(hourlyWeatherForecastDate);
        hourlyWeatherForecastDateTime.appendChild(hourlyWeatherForecastTime);
        hourlyWeatherForecastCard.appendChild(hourlyWeatherForecastDateTime);
        hourlyWeatherForecastCard.appendChild(hourlyWeatherForecastTemperature);
        hourlyWeatherForecastSection.appendChild(hourlyWeatherForecastCard);
        
      }
    }
  
      // Hourly forecast display data
      // console.log(JSON.stringify(locationData))
        const weatherForecastData = (weatherData)=>{
          const { latitude, longitude } = locationData;
          // console.log(JSON.stringify(`locationData ${locationData}`))
          // showLocation()
          // console.log(locationData)
          // 
          let apiUrl;
          if (latitude && longitude) {
            apiUrl = `${weatherApi.baseUrl}forecast?lat=${latitude}&lon=${longitude}&appid=${weatherApi.API_KEY}&units=metric`;
          } else {
            apiUrl = `${weatherApi.baseUrl}forecast?q=${data}&appid=${weatherApi.API_KEY}&units=metric`;
          }
          // 
          // console.log(`apiUrl ${apiUrl}`)
        
        
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
              // console.log(`Data ${JSON.stringify(data)}`)
              // weatherForecastData(data);
              displayWeatherForecastData(data)
            })
            
            .catch(error => {
              console.error('There was a problem fetching the weather data:', error);
              throw error; // Rethrow the error for further handling if necessary
            });
          // 
          // const { main, weather, name, dt, sys, wind, visibility } = data;
          // const { temp, humidity, pressure } = main;
          // const { sunrise, sunset } = sys;
          // const { speed } = wind;
          // const { description, icon } = weather[0];
          // console.log(`Data ${JSON.stringify(data)}`);
          // console.log(data)
          // createHourlyCards()
          // displayWeather()
          // const hourlyWeatherForecastDate = document.querySelectorAll(".hourly-weather-forecast-date");
          // const hourlyWeatherForecastTime = document.querySelectorAll(".hourly-weather-forecast-time");
          // const hourlyWeatherForecastTemperature = document.querySelectorAll(".hourly-weather-forecast-temperature");
  
          // const dailyWeatherForecastDate = document.querySelectorAll(".daily-weather-forecast-date");
          // const dailyWeatherForecastTime = document.querySelectorAll(".daily-weather-forecast-time");
          // const dailyWeatherForecastIcon = document.querySelectorAll(".daily-weather-forecast-icon");
          // const dailyWeatherForecastTemperature = document.querySelectorAll(".daily-weather-forecast-temperature");
          // const dailyWeatherForecastDescription = document.querySelectorAll(".daily-weather-forecast-description");
  
          // for (let index = 0; index < 5; index++) {
          //   hourlyWeatherForecastDate[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "day");
          //   hourlyWeatherForecastTime[index].innerHTML = await formatDate(weatherForecastData.list[index].dt, "hour");
          //   hourlyWeatherForecastTemperature[index].innerHTML = await roundDegree(weatherForecastData.list[index].main.temp);
          // }
  
          // for (let index = 0; index < 5; index++) {
          //   console.log(data.list[index].dt)
          //   hourlyWeatherForecastDate[index].innerHTML = formatDate(data.list[index].dt, "day")
          //   console.log(hourlyWeatherForecastDate)
            
          // }
        }
  // weatherForecastData()
  
  const displayWeatherForecastData = (data)=>{
    
    const frse = document.querySelector(".hourly-weather-forecast-section")
  
    const hourlyWeatherForecastDate = document.querySelectorAll(".hourly-weather-forecast-date");
    const hourlyWeatherForecastTime = document.querySelectorAll(".hourly-weather-forecast-time");
    const hourlyWeatherForecastTemperature = document.querySelectorAll(".hourly-weather-forecast-temperature");
    
    // const { main, weather, name, dt, sys, wind, visibility } = data;
    const { city, list } = data;
    // const { temp, humidity, pressure } = main;
    // const { sunrise, sunset } = sys;
    // const { speed } = wind;
    // const { description, icon } = weather[0];
    // console.log(`Data ${JSON.stringify(data)}`);
    // console.log(data)
    for (let index = 0; index < list.length; index++) {
      // console.log(list[index].dt)
      
    }
    // createHourlyCards()
    // displayWeather()
  
    // const dailyWeatherForecastDate = document.querySelectorAll(".daily-weather-forecast-date");
    // const dailyWeatherForecastTime = document.querySelectorAll(".daily-weather-forecast-time");
    // const dailyWeatherForecastIcon = document.querySelectorAll(".daily-weather-forecast-icon");
    // const dailyWeatherForecastTemperature = document.querySelectorAll(".daily-weather-forecast-temperature");
    // const dailyWeatherForecastDescription = document.querySelectorAll(".daily-weather-forecast-description");
  
  
    for (let index = 0; index < 5; index++) {
      // console.log(`Index: ${index}`);
      // console.log(`Data: ${list[index].dt}`);
      // console.log(`Date Element: ${hourlyWeatherForecastDate[index]}`);
      
      // Update the elements
      if (hourlyWeatherForecastDate[index]) {
          hourlyWeatherForecastDate[index].innerHTML = formatDate(list[index].dt, "day");
      }
      if (hourlyWeatherForecastTime[index]) {
          hourlyWeatherForecastTime[index].innerHTML = formatDate(list[index].dt, "hour");
      }
      if (hourlyWeatherForecastTemperature[index]) {
          hourlyWeatherForecastTemperature[index].innerHTML = roundDegree(list[index].main.temp);
      }
  }
  // frse.append(hourlyWeatherForecastDate)
  // frse.append(hourlyWeatherForecastTime)
  // frse.append(hourlyWeatherForecastTemperature)
  
  
  }
  
  const changeBgImage = (data)=>{
    console.log(data.weather[0].description)
    // const { main, weather } = data;
    // const { description} = weather[0];
    // console.log(description)
    const container = document.querySelector(".main-container")
    
    if (data.weather[0].description == "Clear") {
      container.style.backgroundImage = "url('images/clear.jpg')";
    } else if (data.weather[0].description == "Clouds") {
      container.style.backgroundImage = "url('images/cloud.jpg')";
    } else if (data.weather[0].description == "haze") {
      // container.style.backgroundImage = "url('images/haze.jpg')";
      container.style.backgroundImage = "url('./img/haze.jpg')"
      console.log("kugbki")
    } else if (data.weather[0].description == "Rain") {
      container.style.backgroundImage = "url('images/rain.jpg')";
    } else if (data.weather[0].description == "Snow") {
      container.style.backgroundImage = "url('images/snow.jpg')";
    } else if (data.weather[0].description == "Thunderstorm") {
      container.style.backgroundImage = "url('images/thunderstorm.jpg')";
    } else if (data.weather[0].description == "Mist") {
      container.style.backgroundImage = "url('images/mist.jpg')";
    } else if (data.weather[0].description == "Drizzle") {
      container.style.backgroundImage = "url('images/rain.jpg')";
    }
  }
    window.onload = getLocation;