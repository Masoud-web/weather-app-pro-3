/* =======================================
   Weather App Pro
   Main JavaScript
   Version 2.0
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


/* ---------- Initial Values ---------- */

let currentLanguage = "en";


/* ---------- Title Interaction ---------- */

if (appTitle) {

    appTitle.addEventListener("click", function () {

        appTitle.textContent =
            "Weather App Pro 🌦️";

    });

}


/* ---------- Search Button ---------- */

if (searchBtn) {

    searchBtn.addEventListener("click", function () {

        const city = cityInput.value.trim();

        if (city === "") {

            cityName.textContent =
                "Please enter a city";

            weatherDescription.textContent =
                "Enter a city name to search.";

            return;
        }

        cityName.textContent = city;

        weatherDescription.textContent =
            "Weather data will be loaded soon.";

    });

}


/* ---------- Enter Key Search ---------- */

if (cityInput) {

    cityInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            searchBtn.click();

        }

    });

}


/* ---------- Refresh Button ---------- */

if (refreshBtn) {

    refreshBtn.addEventListener("click", function () {

        cityInput.value = "";

        cityName.textContent =
            "Weather Information";

        temp.textContent = "--";

        humidity.textContent = "--%";

        wind.textContent = "-- km/h";

        pressure.textContent = "-- hPa";

        condition.textContent = "--";

        weatherIcon.textContent = "🌤️";

        weatherDescription.textContent =
            "Search for a city to see the weather";

    });

}


/* ---------- Dark Mode ---------- */

if (themeBtn) {

    themeBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            themeBtn.textContent =
                "☀️ Light Mode";

        } else {

            themeBtn.textContent =
                "🌙 Dark Mode";

        }

    });

}


/* ---------- Language ---------- */

if (languageSelect) {

    languageSelect.addEventListener("change", function () {

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

        } else {

            searchBtn.textContent =
                "Search";

            cityInput.placeholder =
                "Search for a city...";

            themeBtn.textContent =
                document.body.classList.contains("dark")
                    ? "☀️ Light Mode"
                    : "🌙 Dark Mode";

        }

    });

}


/* ---------- Initial Weather Values ---------- */

temp.textContent = "--";

humidity.textContent = "--%";

wind.textContent = "-- km/h";

pressure.textContent = "-- hPa";

condition.textContent = "--";

weatherIcon.textContent = "🌤️";چ
