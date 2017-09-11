var app = new Vue({
  el: '.container',
  data: {
    weatherAPI: "https://api.openweathermap.org/data/2.5/weather?q=Milan&APPID=9ee8bea9f54c2263e946dbaae60e7c7e&units=metric",
    status: 'Ready',
    wheatherInfos: [],
    currentInfos: [{
      wheaterDescription: '-',
      main: {
        temp: 0,
        humidity: 0,
        pressure: 0
      },
      wind: {
        speed: 0
      }
    }]
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
    }
  },
  mounted: function() {
    this.getInfosFromService();
    setInterval(this.getInfosFromService, 600000);
  },
  watch: {
    wheatherInfos: function(newData) {
      this.currentInfos = this.wheatherInfos
      var descr = this.wheatherInfos.weather[0].description
      descr = descr.charAt(0).toUpperCase() + descr.slice(1)
      this.currentInfos.wheaterDescription = descr
    }
  }
});
