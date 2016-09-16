var split     = require('split');
var constants = require('constants');
var https     = require('https');
var sleep     = require('sleep');


function pathForParcel(parcelNumber) {
  return "/ptax_pub_app/RealSearchInit.do?searchByParcel=true&parcelNumber=" + parcelNumber + "&showHistory=Y";
}

function optionsForParcel(parcelNumber) {
  return {
    headers : {
      'Accept'          : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language' : 'en-US,en;q=0.5',
      'DNT'             : '1',
      'User-Agent'      : 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:33.0) Gecko/20100101 Firefox/33.0'
    },
    hostname           : 'www.acgov.org',
    path               : pathForParcel(parcelNumber),
    method             : 'GET',
    agent              : false,
    rejectUnauthorized : false,
    secureOptions      : constants.SSL_OP_NO_TLSv1_2,
    strictSSL          : false
  };
}

function getParcel(parcelNumber, cb) {
  var request = https.request(optionsForParcel(parcelNumber), function(res) {
    var lines  = res.pipe(split());
    var parcel = {
      id         : parcelNumber,
      exists     : true,
      delinquent : 0
    };

    lines.on('data', function (line) {
      if (line.indexOf('No tax bills were found for the information entered') >= 0) {
        parcel.exists = false;
      } else if (line.indexOf('<td align="right" colspan="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>') >= 0) {
        parcel.delinquent++;
      }
    });

    lines.on('end', function (line) {
      process.stderr.write(JSON.stringify(parcel) + '\n');
      cb();
    });
  });

  request.on('error', function(e) {
    process.stderr.write("error: " + e.message);
  });

  request.end();
}


var a     = parseInt(process.argv[2]);
var b     = parseInt(process.argv[3]);
var start = parseInt(process.argv[4]);
var stop  = parseInt(process.argv[5]);

function handleGetNextParcel() {
  sleep.usleep(5000);
  if (start < stop) {
    getParcel(a + "-" + b + "-" + start, handleGetNextParcel);
    start++;
  }
}

handleGetNextParcel();
