///////////////////////////////////////////////////////////////
// Last.fm functions
///////////////////////////////////////////////////////////////


// put your Last.fm API credentials here
var apiUrl     = 'http://ws.audioscrobbler.com/2.0/';
var apiKey     = '';
var apiSecret  = '';
var apiSession = '';


function getApiSignature(params)
{
  var keys = [];
  var string = '';

  for (var key in params)
    keys.push(key);

  keys.sort();

  for (var index in keys)
  {
    var key = keys[index];
    string += key + params[key];
  }

  string += apiSecret;
  return md5(string);
}

function encodeParams(params)
{
  var array = [];

  for (var param in params)
    array.push(encodeURIComponent(param) + "=" + encodeURIComponent(params[param]));

  return array.join('&');
}

function callApi(method, params, httpMethod, signed)
{
  params.method = method;
  params.api_key = apiKey;
  if (signed)
    params.api_sig = getApiSignature(params);

  params = encodeParams(params);

  var http = new ActiveXObject("MSXML2.ServerXMLHTTP.6.0");
  
  if (httpMethod == "POST")
  {
    http.open("POST", apiUrl);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.setRequestHeader("Content-length", params.length);
    http.setRequestHeader("Connection", "close");
    http.send(params);
  }
  else
  {
    http.open("GET", apiUrl + '?' + params.replace(/%20/g, '+'));
    http.send();
  }
  return http;
}

function getTimestamp() // current UTC time in seconds
{
  return Math.round(new Date().getTime() / 1000)
}

LastFM = {};

LastFM.auth = {
  getToken : function()
  {
    return callApi('auth.getToken', {}, "GET", true);
  },
  
  getSession : function(token)
  {
    return callApi('auth.getSession', {'token':token}, "GET", true);
  }
};

LastFM.track = {
  scrobble : function(artist, track, timestamp)
  {
    timestamp = timestamp || getTimestamp();
    return callApi('track.scrobble',
      {
        'timestamp': timestamp.toString(),
        'artist': artist,
        'track': track,
        'sk': apiSession
      },
      "POST", true);
  },
  
  getInfo : function(artist, track)
  {
    return callApi('track.getInfo',
      {
        'artist': artist,
        'track': track
      },
      "GET", false);
  }
};

LastFM.artist = {
  getImages : function(artist, page, limit)
  {
    page  = page  || 1;
    limit = limit || 50;
    return callApi('artist.getImages',
      {
        'artist': artist,
        'page': page,
        'limit': limit,
        'autocorrect': '1'
      },
      "GET", false);
  }
};
