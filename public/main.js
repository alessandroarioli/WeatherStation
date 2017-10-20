const applicationTemplate = `
<div class="container">
  <div class="row">
  <div class="col-md-12">
      <div class="weather-card one">
      <div class="top" v-bind:style="{ 'background-image': 'url(' + badgeImage + ')' }">
        <div class="wrapper">
          <h1 class="heading">{{currentInfos.wheaterDescription}}</h1>
          <h3 class="location">{{location.name}}</h3>
          <p class="temp">
            <span class="temp-value" id="temperature">{{currentInfos.main.temp}}</span>
            <span class="deg">0</span>
            <a><span class="temp-type">C</span></a>
          </p>
          <div class="icon" v-bind:class="[iconClass[0]]">
            <div v-bind:class="[iconClass[1]]"></div>
            <div v-bind:class="[iconClass[2]]">
              <div v-bind:class="[iconClass[3]]"></div>
            </div>
            <div v-bind:class="[iconClass[4]]"></div>
          </div>
          <div class="flex-div">
            <span class="flex-one">
              <u>{{tomorrowDate}}</u> <br>
              <h3>{{forecast.tomorrowDate}}</h3>
            </span>
            <span class="flex-one">
              <u>{{twoDaysPast}}</u> <br>
              <h3>{{forecast.twoDaysPast}}</h3>
            </span>
            <span class="flex-one">
              <u>{{threeDaysPast}}</u> <br>
              <h3>{{forecast.threeDaysPast}}</h3>
            </span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="wrapper">
          <ul class="forecast">
            <a href="javascript:;"><span class="lnr lnr-chevron-up go-up"></span></a>
            <li>
              <span class="date">Humidity</span>
              <span class="lnr condition">
                <span class="temp">{{currentInfos.main.humidity}} %</span>
              </span>
            </li>
            <li>
              <span class="date">Wind speed</span>
              <span class="lnr condition">
                <span class="temp">{{currentInfos.wind.speed}} Km/h</span>
              </span>
            </li>
            <li>
              <span class="date">Pressure</span>
              <span class="lnr condition">
                <span class="temp">{{currentInfos.main.pressure}} hPa</span>
              </span>
            </li>
            <li>
              <span class="date">Pm 2.5</span>
              <span class="lnr condition">
                <span class="temp" v-bind:class="pollution.class">{{pollution.pm25}}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
    </div>

    <div class="row">
      <div class="mynav">
        {{status}}
      </div>
    </div>
</div>`

new Vue({
  el: '#application',
  template: applicationTemplate,
  data: {
    badgeImage: '',
    weatherAPI: "https://api.openweathermap.org/data/2.5/weather?id=6542283&APPID=9ee8bea9f54c2263e946dbaae60e7c7e&units=metric",
    forecastAPI: "https://api.openweathermap.org/data/2.5/forecast?id=6542283&APPID=9ee8bea9f54c2263e946dbaae60e7c7e",
    pollutionAPI: "https://api.waqi.info/feed/Milan/?token=b683eafa205fc53546270ccd53f071e685b476a4",
    pollution: {
      class: '',
      pm25: 30,
      pm10: '',
      no2: '',
      co: ''
    },
    status: 'Ready',
    images: {
      raining: ['raining.jpg', 'raining_2.jpg'],
      nights: ['night.jpg', 'night_2.jpg', 'night_3.jpg'],
      sunny: ['sunny.jpg']
    },
    fontColors: {
      cold: '#41d0f4',
      hot: '#e54f22',
      white: '#ffffff',
      hottest: '#870000',
      coldest: '#0400ff'
    },
    wheatherInfos: [],
    currentInfos: {
      wheaterDescription: '-',
      main: {
        temp: '-',
        humidity: 0,
        pressure: 0
      },
      wind: {
        speed: 0
      }
    },
    location: {
      id: 6542283,
      name: 'Milan, Italy'
    },
    iconClass: [
      '', '', '', '', ''
    ],
    forecast: {
      tomorrowDate: '-',
      twoDaysPast: '-',
      threeDaysPast: '-'
    }
  },
  computed: {
    tomorrowDate: function() {
      var today = new Date();
      return (today.getDate() + 1) + '/' + (today.getMonth() + 1)
    },
    twoDaysPast: function() {
      var today = new Date();
      return (today.getDate() + 2) + '/' + (today.getMonth() + 1)
    },
    threeDaysPast: function() {
      var today = new Date();
      return (today.getDate() + 3) + '/' + (today.getMonth() + 1)
    }
  },
  methods: {
    getInfosFromService: function() {
      this.status = 'Getting informations from satellite ...'
      var vueObj = this
      axios.get(this.weatherAPI)
          .then(function (response) {
            vueObj.wheatherInfos = response.data
            var currentdate = new Date();
            var sync = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
            vueObj.status = sync
          })
          .catch(function (error) {
            vueObj.status = 'Error! Could not reach the API. ' + error
          })
    },
    setBackgroundImage: function() {
      var time = new Date().getHours();
      var image;

      if (this.currentInfos.wheaterDescription.includes('rain')) {
        image = this.images.rain[Math.floor(Math.random() * this.images.rain.length)]
      } else {
          if (time > 5 && time < 18) {
          image = this.images.sunny[Math.floor(Math.random() * this.images.sunny.length)]
        } else {
          image = this.images.nights[Math.floor(Math.random() * this.images.nights.length)]
        }
      }
      this.badgeImage = image
    },
    setTemperatureColor: function() {
      var temp = parseFloat(document.getElementById('temperature').innerText);
      var style = document.getElementById('temperature').style;

      if (temp < 15) {
        style.color = this.fontColors.cold
      } else if (temp > 28) {
        style.color = this.fontColors.hot
      } else if (temp > 35) {
        style.color = this.fontColors.hottest
      } else if (temp < 5) {
        style.color = this.fontColors.coldest
      } else {
        style.color = this.fontColors.white
      }

    },
    getForecast: function() {
      var vueObj = this;

      axios.get(this.forecastAPI)
          .then(function (response) {
            vueObj.forecast.tomorrowDate = response.data.list[1].weather[0].description
            vueObj.forecast.twoDaysPast = response.data.list[2].weather[0].description
            vueObj.forecast.threeDaysPast = response.data.list[3].weather[0].description
          })
    },
    setAnimatedIcon: function() {
      var desc = this.currentInfos.wheaterDescription.toLowerCase();

      if (desc.includes('sun')) {
        if (desc.includes('cloud')) {
          this.iconClass = ['sun-shower', 'cloud', 'sun', 'rays', 'rain']
        } else {
          this.iconClass = ['sunny', '', 'sun', 'rays', '']
        }
      } else if (desc.includes('clear sky')) {
        this.iconClass = ['sunny', '', 'sun', 'rays', '']
      } else if (desc.includes('storm')) {
        this.iconClass = ['thunder-storm', 'cloud', 'lightning', 'bolt', 'bolt']
      } else if (desc.includes('rain')) {
        this.iconClass = ['rainy', 'cloud', '', '', 'rain']
      } else if (desc.includes('snow')) {
        this.iconClass = ['flurries', 'cloud', 'snow', 'flake', 'flake']
      } else {
        this.iconClass = ['cloudy', 'cloud', 'cloud', '', '']
      }
    },
    getPollutionValues: function() {
      var vueObj = this

      axios.get(this.pollutionAPI)
        .then(function (response) {
          vueObj.pollution.pm25 = response.data.data.iaqi.pm25.v
          vueObj.setPollutionColor();
        })
    },
    setPollutionColor: function() {
      var pollutionVal = this.pollution.pm25

      if (pollutionVal > 0 && pollutionVal <= 40) {
        this.pollution.class = 'good'
      } else if (pollutionVal > 41 && pollutionVal <= 70) {
        this.pollution.class = 'moderate'
      } else if (pollutionVal > 71 && pollutionVal <= 100) {
        this.pollution.class = 'unhealthy'
      } else {
        this.pollution.class = 'very-unhealthy'
      }
    }
  },
  created: function() {
    this.getInfosFromService();
    this.getPollutionValues();
    this.setBackgroundImage();
    setInterval(this.getInfosFromService, 300000);
  },
  updated: function() {
    this.setTemperatureColor();
    this.getForecast();
  },
  watch: {
    wheatherInfos: function(newData) {
      this.currentInfos = this.wheatherInfos
      if (this.wheatherInfos.weather.length !== 1) {
        var descr = []
        this.wheatherInfos.weather.map(function(obj) {
          descr.push(' ' + obj.description)
        });
        descr = descr.join()
      } else {
        var descr = this.wheatherInfos.weather[0].description
        descr = descr.charAt(0).toUpperCase() + descr.slice(1)
      }
      this.currentInfos.wheaterDescription = descr
      this.setAnimatedIcon();
    }
  }
});
