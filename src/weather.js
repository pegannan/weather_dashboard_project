const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');

const weatherInfoSection =document.querySelector('.weather-info');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-message');

const countryTxt =document.querySelector('.country-txt');
const tempTxt =document.querySelector('.temp-txt');
const feelsLikeTxt = document.querySelector('.feels-like-txt');
const conditionTxt =document.querySelector('.condition-txt');
const humidityValueTxt =document.querySelector('.humidity-value-txt');
const windValueTxt =document.querySelector('.wind-value-txt');
const weatherSummaryImg =document.querySelector('.weather-summary-img');
const currentDateTxt =document.querySelector('.current-date-txt');

const forecastItemsContainer = document.querySelector('.forecast-items-container')

const lang = 'en'
const apiKey = 'f006b0f5cddfc0666b126a50a4dbdb18'

searchBtn.addEventListener('click', () => {
    console.log(cityInput.value)
   
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value =''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' &&
        cityInput.value.trim() != ''
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value =''
        cityInput.blur()
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric&lang=${lang}`;
    
        const response = await fetch(apiUrl);
        
        return await response.json();
    }


function getWeatherIcon(id) {
    console.log(id)
    if(id <= 232 ) return'thunderstorm.svg'
    if(id > 232 && id <= 321 ) return'drizzle.svg'
    if(id > 321 && id <= 531 ) return'rain.svg'
    if(id > 531 && id <= 622 ) return'snow.svg'
    if(id > 622 && id <= 781 ) return'atmosphere.svg'
    if(id = 800 ) return'clear.svg'
    if(id > 801 ) return'clouds.svg'

    else return 'clouds.svg'
}

//change background
function getWeatherBackground(main) {

    switch (main) {
        case "Thunderstorm":
            document.body.style.background = "url(assets/thunderstorm.gif)", 
            document.body.style.backgroundSize = "cover",
            document.body.style.backgroundPosition = "Center"
    break;
        case "Drizzle":
            document.body.style.background = "url(/assets/drizzle.png)", 
            document.body.style.backgroundSize = "cover",
            document.body.style.backgroundPosition = "Center"
    break;
        case "Rain":
            document.body.style.background = "url(/assets/rain.gif)", 
            document.body.style.backgroundSize = "cover",
            document.body.style.backgroundPosition = "Center"
    break;
        case "Snow":
            document.body.style.background = "url(/assets/snow.jpg)", 
            document.body.style.backgroundSize = "cover",
            document.body.style.backgroundPosition = "Center"
    break;
        case "Atmosphere":
            document.body.style.background = "url(/assets/atmosphere.png)", 
            document.body.style.backgroundSize = "cover",
            document.body.style.backgroundPosition = "Center"
    break;
    case "Mist":
        document.body.style.background = "url(/assets/atmosphere.jpg)", 
        document.body.style.backgroundSize = "cover",
        document.body.style.backgroundPosition = "Center"
    break;
        case "Clear":
            document.body.style.background = "url(/assets/clear.jpg)", 
            document.body.style.backgroundSize = "cover",
            document.body.style.backgroundPosition = "Center"
    break;
        case "Clouds":
            document.body.style.background = "url(/assets/clouds.jpg)", 
            document.body.style.backgroundSize = "cover",
            document.body.style.backgroundPosition = "Center"
    break;
        default:
            document.body.style.background = "url(/assets/clear.jpg)", 
            document.body.style.backgroundSize = "cover",
            document.body.style.backgroundPosition = "center"  
        
}


}

function getCurrentDate() {
    const currentDate = new Date()
   const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
   }
   return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);
    console.log(weatherData)
    if(weatherData.cod != 200) {
        showDisplaySection(notFoundSection);
        return
    }
    
    const {
        sys: {country},
        name: name,
        main: {temp, humidity, feels_like },
        weather: [{id, description, main}],
        wind: {speed},
    } = weatherData

    countryTxt.textContent = name + ', ' + country
    tempTxt.textContent = Math.round (temp) +'°C'
    feelsLikeTxt.textContent ='Feels like ' + '' + Math.round (feels_like) +'°C'
    conditionTxt.textContent = description
    humidityValueTxt.textContent = humidity + '%'
    windValueTxt.textContent = speed + 'M/s'

    currentDateTxt.textContent = getCurrentDate()
    console.log(getCurrentDate())
    weatherSummaryImg.src = `/weather/${getWeatherIcon(id)}`

    getWeatherBackground(main);

    await updateForecastInfo(city) 
        showDisplaySection(weatherInfoSection);
    } 

async function updateForecastInfo(city) {
    const forecastData = await getFetchData('forecast', city);
    
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split ('T') [0]
    
    forecastItemsContainer.innerHTML = ''
    forecastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(timeTaken) && 
            !forecastWeather.dt_txt.includes(todayDate)){
                updateForecastItems(forecastWeather)
        }
    } )
}

function updateForecastItems(weatherData) {

    const {
        dt_txt: date,
        weather: [{id}],
        main: {temp},
    }= weatherData

    const dateTaken = new Date(date)
    const dateOptions = {
        day: '2-digit',
        month: 'short',
    }

    const dateResult = dateTaken.toLocaleDateString('en-US', dateOptions)

    const forecastItem = 
    `           <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                    <img src="weather/${getWeatherIcon(id)}" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${Math.round (temp)}°C</h5>
                </div>`

        forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

        section.style.display = 'flex';
    };


function dropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
