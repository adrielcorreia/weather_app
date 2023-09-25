const api_key = '8c70e558c8e33a99031aaeb43ee7ab5b';
const search_box = document.querySelector('.search-box');
const today_info = document.querySelector('.local-info');
const today_temp = document.querySelector('.weather-temp');
const days_list = document.querySelector('.days-list');
const search = document.querySelector('.search');
const days = document.querySelector('.days');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const theme = document.querySelector('#theme');
var root = document.querySelector('body');
let light_mode = false;

days.style.display = 'none';
loader.style.display = 'none';
error.style.display = 'none';

theme.addEventListener('click', () => {
    if (light_mode == false) {
        light_mode = true;
        theme.style.backgroundImage = 'url(./assets/dark-mode.svg)';
        document.body.classList.add('light-theme');
    } else {
        light_mode = false
        theme.style.backgroundImage = 'url(./assets/light-mode.svg)';
        document.body.classList.remove('light-theme');
    }
    console.log(light_mode);
})

function fetchWeatherData(location) {
    days.style.display = 'none';
    loader.style.display = 'block';
    error.style.display = 'none';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${api_key}&units=metric&lang=pt_br`;

    fetch(apiUrl).then(response => response.json()).then(data => {
        //atualizar today-temp
        const today_weather = data.list[0].weather[0].description;
        const today_temperature = `${Math.round(data.list[0].main.temp)}°C`;
        const location_element = document.querySelector('.location');
        const weather_desc_element = document.querySelector('.weather-desc');
        const today_precipitation = `${data.list[0].pop}%`;
        const today_humidity = `${data.list[0].main.humidity}%`;
        const today_wind_speed = `${data.list[0].wind.speed} km/h`;

        const precipitation = document.querySelector('#precipitation');
        const humidity = document.querySelector('#humidity');
        const wind_speed = document.querySelector('#wind-speed');

        today_info.querySelector('#day').textContent = new Date().toLocaleDateString('pt-br', {weekday: 'long'});
        today_info.querySelector('#dmy').textContent = new Date().toLocaleDateString('pt-br', {day: 'numeric', month: 'long', year: 'numeric'});

        today_temp.textContent = today_temperature;
        location_element.textContent = `${data.city.name}, ${data.city.country}`;
        weather_desc_element.textContent = today_weather;
        precipitation.textContent = today_precipitation;
        humidity.textContent = today_humidity;
        wind_speed.textContent = today_wind_speed;

        const today = new Date();
        const next_days_data = data.list.slice(1);
        const unique_days = new Set();
        let count = 0;
        let i = 0;
        days_list.innerHTML = '';
        console.log(next_days_data.length);

        for (const dayData of next_days_data) {
            const forecast_data = new Date(dayData.dt_txt);
            const day_abv = forecast_data.toLocaleDateString('pt-br', {weekday: 'short'});
            const day_temp = `${Math.round(dayData.main.temp)}°C`;
            const day_desc = data.list[i].weather[0].description;
            i++;

            console.log(!unique_days.has(day_abv) && forecast_data.getDate() !== today.getDate())
            
            if (!unique_days.has(day_abv) && forecast_data.getDate() !== today.getDate()) {
                unique_days.add(day_abv);

                days_list.innerHTML += `
                    <li>
                        <span class="next-day" >${day_abv}</span>
                        <span class="temp" >${day_temp}</span>
                        <span class='day-desc'>${day_desc}</span>
                    </li>
                `;

                count++;
                console.log(i);
            }

            if (count === 4) {
                days.style.display = 'block';
                loader.style.display = 'none';
                error.style.display = 'none';
                break;
            }
        }
    }).catch (() => {
        loader.style.display = 'none';
        error.style.display = 'block';
    })
}

search.addEventListener('keyup', function(e) {
    var key = e.which || e.keyCode;
    if (!search.value == '') {
        if (key == 13) {
            fetchWeatherData(this.value);
        }
    };
});
