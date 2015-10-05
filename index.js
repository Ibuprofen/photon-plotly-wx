var PLOTLY_USER = process.env.PLOTLY_USER,
    PLOTLY_PASS = process.env.PLOTLY_PASS,
    PARTICLE_ACCESS_TOKEN = process.env.PARTICLE_ACCESS_TOKEN,
    DEVICE_ID = process.env.DEVICE_ID;

var _ = require('lodash'),
    plotly = require('plotly')(PLOTLY_USER, PLOTLY_PASS),
    spark = require('spark'),
    moment = require('moment');

var graphOptions = {
  filename: 'wx1',
  fileopt: 'extend',
  style: {
    type: "scatter"
  },
  layout: {
    title: 'Weather Data',
    xaxis: {
      title: "Date and Time"
    },
    yaxis: {
      title: ""
    }
  }
};

spark.login({ accessToken: PARTICLE_ACCESS_TOKEN }, function() {
  console.log('Successful Authentication');

  spark.getEventStream('weather', DEVICE_ID, function(res) {
    res.data = JSON.parse(res.data);
    console.log(res);

    var plotData = _.map(_.keys(res.data), function(k) {
      return {
        x: [moment(res.data.published_at).utc().format('YYYY-MM-DD HH:mm')],
        y: [res.data[k]],
        type: 'scatter',
        name: k
      };
    });

    console.log(plotData);

    plotly.plot(plotData, graphOptions, function (err, msg) {
      if (err) { console.log(err); }
      console.log(msg);
    });

  });

});

