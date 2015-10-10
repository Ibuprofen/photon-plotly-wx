var PLOTLY_USER = process.env.PLOTLY_USER,
    PLOTLY_PASS = process.env.PLOTLY_PASS,
    PARTICLE_ACCESS_TOKEN = process.env.PARTICLE_ACCESS_TOKEN,
    DEVICE_ID = process.env.DEVICE_ID;

var _ = require('lodash'),
    plotly = require('plotly')(PLOTLY_USER, PLOTLY_PASS),
    spark = require('spark'),
    moment = require('moment');

var graphOptions = {
  filename: 'wx',
  fileopt: 'extend',
  layout: {
    title: 'Weather Data',
    yaxis: {
      title: "Humdity [%], Degrees [F]",
      domain: [0.4, 1]
    },
    yaxis2: {
      title: "Pressure [Pa]",
      domain: [0, 0.3]
    }
  }
};

spark.login({ accessToken: PARTICLE_ACCESS_TOKEN }, function() {
  console.log('Successful Authentication');

  spark.getEventStream('weather', DEVICE_ID, function(res) {
    res.data = JSON.parse(res.data);
    console.log(res);

    var plotData = _.map(res.data, function(v, k) {
      var result = {
        x: [moment(res.data.published_at).format('YYYY-MM-DD HH:mm')],
        y: [v],
        type: 'scatter',
        name: k
      };

      if (k === 'pa') {
        result.yaxis = 'y2';
      } 

      return result;
    });

    console.log(plotData);

    plotly.plot(plotData, graphOptions, function (err, msg) {
      if (err) { console.log(err); }
      console.log(msg);
    });

  });

});

