/* =======================================
   Weather App Pro
   Main JavaScript
   Version 3.0
   Open-Meteo API
   ======================================= */


/* ---------- DOM Elements ---------- */

const appTitle = document.querySelector("h1");

const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temp = document.getElementById("temp");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription =
    document.getElementById("weatherDescription");

const condition = document.getElementById("condition");

const refreshBtn = document.getElementById("refreshBtn");
const themeBtn = document.getElementById("themeBtn");

const languageSelect =
    document.getElementById("language");


/* ---------- App State ---------- */

let currentLanguage = "en";

let currentLatitude = null;
let currentLongitude = null;
let currentCity = "";


/* ---------- Weather Codes ---------- */

/*
    Open-Meteo Weather Codes

    0       Clear sky
    1-3     Mainly clear / cloudy
    45-48   Fog
    51-57   Drizzle
    61-67   Rain
    71-77   Snow
    80-82   Rain showers
    85-86   Snow showers
    95      Thunderstorm
    96-99   Thunderstorm with hail
*/

function getWeatherInfo(code) {

    const weatherData = {

        0: {
            icon: "☀️",
            en: "Clear sky",
            de: "Klarer Himmel"
        },

        1: {
            icon: "🌤️",
            en: "Mainly clear",
            de: "Überwiegend klar"
        },

        2: {
            icon: "⛅",
            en: "Partly cloudy",
            de: "Teilweise bewölkt"
        },

        3: {
            icon: "☁️",
            en: "Overcast",
            de: "Bedeckt"
        },

        45: {
            icon: "🌫️",
            en: "Fog",
            de: "Nebel"
        },

        48: {
            icon: "🌫️",
            en: "Depositing rime fog",
            de: "Reifnebel"
        },

        51: {
            icon: "🌦️",
            en: "Light drizzle",
            de: "Leichter Nieselregen"
        },

        53: {
            icon: "🌦️",
            en: "Moderate drizzle",
            de: "Mäßiger Nieselregen"
        },

        55: {
            icon: "🌧️",
            en: "Dense drizzle",
            de: "Starker Nieselregen"
        },

        56: {
            icon: "🌧️",
            en: "Light freezing drizzle",
            de: "Leichter gefrierender Nieselregen"
        },

        57: {
            icon: "🌧️",
            en: "Dense freezing drizzle",
            de: "Starker gefrierender Nieselregen"
        },

        61: {
            icon: "🌧️",
            en: "Slight rain",
            de: "Leichter Regen"
        },

        63: {
            icon: "🌧️",
            en: "Moderate rain",
            de: "Mäßiger Regen"
        },

        65: {
            icon: "🌧️",
            en: "Heavy rain",
            de: "Starker Regen"
        },

        66: {
            icon: "🌧️",
            en: "Light freezing rain",
            de: "Leichter gefrierender Regen"
        },

        67: {
            icon: "🌧️",
            en: "Heavy freezing rain",
            de: "Starker gefrierender Regen"
        },

        71: {
            icon: "🌨️",
            en: "Slight snow",
            de: "Leichter Schneefall"
        },

        73: {
            icon: "🌨️",
            en: "Moderate snow",
            de: "Mäßiger Schneefall"
        },

        75: {
            icon: "❄️",
            en: "Heavy snow",
            de: "Starker Schneefall"
        },

        77: {
            icon: "❄️",
            en: "Snow grains",
            de: "Schneekörner"
        },

        80: {
            icon: "🌦️",
            en: "Slight rain showers",
            de: "Leichte Regenschauer"
        },

        81: {
            icon: "🌧️",
            en: "Moderate rain showers",
            de: "Mäßige Regenschauer"
        },

        82: {
            icon: "⛈️",
            en: "Violent rain showers",
            de: "Starke Regenschauer"
        },

        85: {
            icon: "🌨️",
            en: "Slight snow showers",
            de: "Leichte Schneeschauer"
        },

        86: {
            icon: "❄️",
            en: "Heavy snow showers",
            de: "Starke Schneeschauer"
        },

        95: {
            icon: "⛈️",
            en: "Thunderstorm",
            de: "Gewitter"
        },

        96: {
            icon: "⛈️",
            en: "Thunderstorm with slight hail",
            de: "Gewitter mit leichtem Hagel"
        },

        99: {
            icon: "⛈️",
            en: "Thunderstorm with heavy hail",
            de: "Gewitter mit starkem Hagel"
        }

    };

    return weatherData[code] || {
        icon: "🌤️",
        en: "Unknown",
        de: "Unbekannt"
    };
}


/* ---------- Loading State ---------- */

function showLoading() {

    cityName.textContent =
        currentLanguage === "de"
            ? "Wird geladen..."
            : "Loading...";

    weatherDescription.textContent =
        currentLanguage === "de"
            ? "Wetterdaten werden abgerufen..."
            : "Fetching weather data...";

    weatherIcon.textContent = "⏳";

    temp.textContent = "--";

    humidity.textContent = "--%";

    wind.textContent = "-- km/h";

    pressure.textContent = "-- hPa";

    condition.textContent = "--";
}


/* ---------- Error Message ---------- */

function showError(message) {

    cityName.textContent =
        currentLanguage === "de"
            ? "Fehler"
            : "Error";

    weatherDescription.textContent = message;

    weatherIcon.textContent = "❌";

    temp.textContent = "--";

    humidity.textContent = "--%";

    wind.textContent = "-- km/h";

    pressure.textContent = "-- hPa";

    condition.textContent = "--";
}


/* ---------- Find City ---------- */

async function findCity(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Geocoding request failed."
        );

    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {

        throw new Error(
            currentLanguage === "de"
                ? "Stadt nicht gefunden."
                : "City not found."
        );

    }

    return data.results[0];
}


/* ---------- Get Weather ---------- */

async function getWeather(latitude, longitude) {

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(
            "Weather request failed."
        );

    }

    return await response.json();
}


/* ---------- Display Weather ---------- */

function displayWeather(cityData, weatherData) {

    const current = weatherData.current;

    const weatherInfo =
        getWeatherInfo(current.weather_code);


    /* ---------- Save Current Location ---------- */

    currentLatitude = cityData.latitude;

    currentLongitude = cityData.longitude;

    currentCity = cityData.name;


    /* ---------- City ---------- */

    let locationText = cityData.name;

    if (cityData.country) {

        locationText +=
            `, ${cityData.country}`;

    }

    cityName.textContent =
        locationText;


    /* ---------- Temperature ---------- */

    temp.textContent =
        Math.round(current.temperature_2m);


    /* ---------- Humidity ---------- */

    humidity.textContent =
        `${Math.round(
            current.relative_humidity_2m
        )}%`;


    /* ---------- Wind ---------- */

    wind.textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    /* ---------- Pressure ---------- */

    pressure.textContent =
        `${Math.round(
            current.surface_pressure
        )} hPa`;


    /* ---------- Weather Icon ---------- */

    weatherIcon.textContent =
        weatherInfo.icon;


    /* ---------- Weather Description ---------- */

    weatherDescription.textContent =
        currentLanguage === "de"
            ? weatherInfo.de
            : weatherInfo.en;


    /* ---------- Condition ---------- */

    condition.textContent =
        currentLanguage === "de"
            ? weatherInfo.de
            : weatherInfo.en;

}


/* ---------- Search Weather ---------- */

async function searchWeather() {

    const city =
        cityInput.value.trim();


    if (city === "") {

        showError(
            currentLanguage === "de"
                ? "Bitte geben Sie eine Stadt ein."
                : "Please enter a city."
        );

        return;
    }


    showLoading();


    try {

        const cityData =
            await findCity(city);


        const weatherData =
            await getWeather(
                cityData.latitude,
                cityData.longitude
            );


        displayWeather(
            cityData,
            weatherData
        );


    } catch (error) {

        console.error(
            "Weather App Error:",
            error
        );


        showError(
            currentLanguage === "de"
                ? "Wetterdaten konnten nicht geladen werden."
                : "Unable to load weather data."
        );

    }

}


/* ---------- Search Button ---------- */

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchWeather
    );

}


/* ---------- Enter Key ---------- */

if (cityInput) {

    cityInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                searchWeather();

            }

        }
    );

}


/* ---------- Refresh ---------- */

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async function () {

            if (
                currentLatitude !== null &&
                currentLongitude !== null
            ) {

                showLoading();

                try {

                    const weatherData =
                        await getWeather(
                            currentLatitude,
                            currentLongitude
                        );


                    const cityData = {
                        name: currentCity,
                        latitude: currentLatitude,
                        longitude: currentLongitude
                    };


                    displayWeather(
                        cityData,
                        weatherData
                    );


                } catch (error) {

                    console.error(error);

                    showError(
                        currentLanguage === "de"
                            ? "Aktualisierung fehlgeschlagen."
                            : "Refresh failed."
                    );

                }

            } else {

                cityInput.value = "";

                cityName.textContent =
                    currentLanguage === "de"
                        ? "Wetterinformationen"
                        : "Weather Information";

                temp.textContent = "--";

                humidity.textContent = "--%";

                wind.textContent = "-- km/h";

                pressure.textContent = "-- hPa";

                condition.textContent = "--";

                weatherIcon.textContent = "🌤️";

                weatherDescription.textContent =
                    currentLanguage === "de"
                        ? "Suchen Sie nach einer Stadt."
                        : "Search for a city to see the weather.";

            }

        }
    );

}


/* ---------- Dark Mode ---------- */

if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        function () {

            document.body.classList.toggle("dark");


            if (
                document.body.classList.contains("dark")
            ) {

                themeBtn.textContent =
                    currentLanguage === "de"
                        ? "☀️ Heller Modus"
                        : "☀️ Light Mode";

            } else {

                themeBtn.textContent =
                    currentLanguage === "de"
                        ? "🌙 Dunkler Modus"
                        : "🌙 Dark Mode";

            }

        }
    );

}


/* ---------- Language ---------- */

if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function () {

            currentLanguage =
                languageSelect.value;


            if (currentLanguage === "de") {

                searchBtn.textContent =
                    "Suchen";

                cityInput.placeholder =
                    "Stadt suchen...";


                themeBtn.textContent =
                    document.body.classList.contains("dark")
                        ? "☀️ Heller Modus"
                        : "🌙 Dunkler Modus";


                if (currentCity) {

                    weatherDescription.textContent =
                        getWeatherInfo(
                            lastWeatherCode
                        ).de;

                    condition.textContent =
                        getWeatherInfo(
                            lastWeatherCode
                        ).de;

                }

            } else {

                searchBtn.textContent =
                    "Search";

                cityInput.placeholder =
                    "Search for a city...";


                themeBtn.textContent =
                    document.body.classList.contains("dark")
                        ? "☀️ Light Mode"
                        : "🌙 Dark Mode";


                if (currentCity) {

                    weatherDescription.textContent =
                        getWeatherInfo(
                            lastWeatherCode
                        ).en;

                    condition.textContent =
                        getWeatherInfo(
                            lastWeatherCode
                        ).en;

                }

            }

        }
    );

}


/* ---------- Last Weather Code ---------- */

let lastWeatherCode = 0;


/* ---------- Improved Display ---------- */

/*
   Save the weather code whenever weather
   information is displayed.
*/

const originalDisplayWeather =
    displayWeather;

displayWeather = function (
    cityData,
    weatherData
) {

    lastWeatherCode =
        weatherData.current.weather_code;

    originalDisplayWeather(
        cityData,
        weatherData
    );

};


/* ---------- Initial Values ---------- */

temp.textContent = "--";

humidity.textContent = "--%";

wind.textContent = "-- km/h";

pressure.textContent = "-- hPa";

condition.textContent = "--";

weatherIcon.textContent = "🌤️";
