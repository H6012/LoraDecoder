var express = require('express')
var lora_packet = require('lora-packet');

var app = express()

 

 
app.get('/decoder', function (req, res) {
  
  var res_str;
  
  res_str = ' <html> <head></head><body>';

  var NwkSKey_str = req.param('nw_key');
  var AppSKey_str = req.param('app_key');
  var Data_str = req.param('data_packet');

  var NwkSKey = new Buffer(NwkSKey_str, 'hex');
  var AppSKey = new Buffer(AppSKey_str, 'hex');
  var packet = lora_packet.fromWire(new Buffer(Data_str , 'hex'));


res_str+=(packet.toString());
res_str+=('<br>');

res_str+=('packet MIC=' + packet.getBuffers().MIC.toString('hex'));
res_str+=('<br>');
res_str+=("FRMPayload=" + packet.getBuffers().FRMPayload.toString('hex'));
res_str+=('<br>');
res_str+=("MIC check=" + (lora_packet.verifyMIC(packet, NwkSKey) ? "OK" : "fail"));
res_str+=('<br>');
res_str+=("calculated MIC=" + lora_packet.calculateMIC(packet, NwkSKey).toString('hex'));
res_str+=('<br>');
res_str+=("Decrypted='" + lora_packet.decrypt(packet, AppSKey, NwkSKey).toString() + "'");

res_str += '</body></html>';

res.send(res_str);

})
 
app.listen(3000)



 


 

 

 
