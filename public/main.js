var app = new Vue({
  el: '.container',
  data: {
    location: {
      id: 6542283,
      name: 'Milan, Italy'
    },
    weatherAPI: "https://api.openweathermap.org/data/2.5/weather?id=6542283&APPID=9ee8bea9f54c2263e946dbaae60e7c7e&units=metric",
    forecastAPI: "https://api.openweathermap.org/data/2.5/forecast?id=6542283&APPID=9ee8bea9f54c2263e946dbaae60e7c7e",
    pollutionAPI: "https://api.waqi.info/feed/Milan/?token=b683eafa205fc53546270ccd53f071e685b476a4",
    forecast: {
      tomorrowDate: '-',
      twoDaysPast: '-',
      threeDaysPast: '-'
    },
    pollution: {
      class: '',
      pm25: '',
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
    iconClass: [
      '', '', '', '', ''
    ],
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
      var badgeContainer = document.getElementById('badge');
      var time = new Date().getHours();

      if (this.currentInfos.wheaterDescription.includes('rain')) {
        var rainingImage = this.images.rain[Math.floor(Math.random() * this.images.rain.length)]
        badgeContainer.style.backgroundImage = "url('" + rainingImage + "')"
      } else {
          if (time > 5 && time < 18) {
          var sunnyImage = this.images.sunny[Math.floor(Math.random() * this.images.sunny.length)]
          badgeContainer.style.backgroundImage = "url('" + sunnyImage + "')"
        } else {
          var nightImage = this.images.nights[Math.floor(Math.random() * this.images.nights.length)]
          badgeContainer.style.backgroundImage = "url('" + nightImage + "')"
        }
      }
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
      var vueObj = this

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

      if (pollutionVal > 0 && pollutionVal <= 50) {
        this.pollution.class = 'good'
      } else if (pollutionVal > 50 && pollutionVal <= 100) {
        this.pollution.class = 'moderate'
      } else if (pollutionVal > 101 && pollutionVal <= 150) {
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
  }
});
