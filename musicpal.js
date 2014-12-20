///////////////////////////////////////////////////////////////
// MusicPal functions
///////////////////////////////////////////////////////////////


function getStringElement(xml, tagname)
{
  return xml.getElementsByTagName(tagname)[0].text;
}

function getIntegerElement(xml, tagname)
{
  return parseInt(getStringElement(xml, tagname));
}

// send async get request
function sendGET(url)
{
  var http = new ActiveXObject("MSXML2.ServerXMLHTTP.6.0");
  http.open("GET", url, true, "admin", "admin");
  http.send();
}


MusicPal =
{
  getStatus : function()
  {
    var url = "http://musicpal/admin/cgi-bin/state.cgi?fav=0";
    var http = new ActiveXObject("MSXML2.ServerXMLHTTP.6.0");
    http.open("GET", url, false, "admin", "admin");
    http.send();
    return http.responseXML;
  },
  
  powerUp : function() {
    sendGET('http://musicpal/admin/cgi-bin/ipc_send?power_up');
  },

  powerDown : function() {
    sendGET('http://musicpal/admin/cgi-bin/ipc_send?power_down');
  },

  volumeDown : function() {
    sendGET('http://musicpal/admin/cgi-bin/admin.cgi?f=volume_dec');
  },

  volumeUp : function() {
    sendGET('http://musicpal/admin/cgi-bin/admin.cgi?f=volume_inc');
  },
  
  playPause : function() {
    sendGET('http://musicpal/admin/cgi-bin/admin.cgi?f=play_pause');
  },
  
  nextTrack : function() {
    sendGET('http://musicpal/admin/cgi-bin/admin.cgi?f=next_song');
  },

  getNowPlaying : function()
  {
    var xml = MusicPal.getStatus();
    var playerState = getIntegerElement(xml, 'player_state');
    var isWebRadio  = getIntegerElement(xml, 'is_internet_radio');
    if (!playerState || isWebRadio)
      return null;
    var np = getStringElement(xml, 'now_playing');
    var match = /(.+) - (.+)/.exec(np);
    if (!match)
      return null;
    return {'artist': match[1], 'track': match[2]};
  }
};



