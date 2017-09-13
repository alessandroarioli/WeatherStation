var app = new Vue({
  el: '.container',
  data: {
    location: 'Milan, Italy',
    weatherAPI: "https://api.openweathermap.org/data/2.5/weather?q=Milan&APPID=9ee8bea9f54c2263e946dbaae60e7c7e&units=metric",
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
          if (06 < time > 18) {
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

    }
  },
  created: function() {
    this.getInfosFromService();
    this.setBackgroundImage();
    setInterval(this.getInfosFromService, 300000);
  },
  updated: function() {
    this.setTemperatureColor();
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
    }
  }
});
