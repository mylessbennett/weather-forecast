const weatherbitKey = config.WEATHERBIT_KEY;

// fetch 5 day forecast data
const getWeather = (city) => {
    return new Promise((resolve, reject) => {
        return $.ajax({
            url: `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&days=5&key=${weatherbitKey}`,
            method: 'GET',
            success: (res) => resolve(res),
            error: (err) => reject(err)
        });
    });
};

// takes forecast data as argument and renders forecast UI
const renderForecast = (foreCastData) => {
    const foreCast = foreCastData.data;
    let foreCastHtml = ``;

    foreCast.forEach(item => {
        // format date as text
        const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
        const date = new Date(item.datetime);
        foreCastHtml += `
            <div class="day-container">
                <span class="date">${date.toLocaleDateString("en-US", dateOptions)}</span>
                <div><img src="img/${item.weather.icon}.png" alt="${item.weather.description}"></div>
                <span class="temp">${Math.round(item.temp)}°C</span>
            </div>
        `;
    });

    $('#forecast').empty();
    $('#forecast').append(foreCastHtml);
};

const handleWeatherFetch = () => {
    const city = $('#city').val();
    if (!city) return;
    getWeather(city)
        .then(data => {
            renderForecast(data);
        })
        .catch(() => {
            $('.error-msg').text('There was a problem retrieving the requested data, please try again.').show();
        });
};

const validateSelect = () => {
    const city = $('#city').val();
    if (city) {
        $('.error-msg').hide();
        $('#get-weather').removeClass('disabled');
    } else {
        $('#get-weather').addClass('disabled');
        $('.error-msg').text('Please select a city.').show();
    }
};

const removeForecast = () => {
    $('#forecast').empty();
};


$(document).ready(() => {
    // attach event handlers
    $('#city').on('change', () => {
        validateSelect();
        handleWeatherFetch();
    });

    $('#get-weather').on('click', () => {
        validateSelect();
        handleWeatherFetch();
    });

    $('#reset').on('click', () => {
        removeForecast();
    });
});