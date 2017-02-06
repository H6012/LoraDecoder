var express = require('express')
var lora_packet = require('lora-packet');

var app = express()

// decode a packet 
var packet = lora_packet.fromWire(new Buffer('40F17DBE4900020001954378762B11FF0D', 'hex'));
// debug: prints out contents 
// - contents depend on packet type 
// - contents are named based on LoRa spec 
console.log("packet.toString()=\n" + packet);

// e.g. retrieve payload elements 
console.log("packet MIC=" + packet.getBuffers().MIC.toString('hex'));
console.log("FRMPayload=" + packet.getBuffers().FRMPayload.toString('hex'));
 
// check MIC 
var NwkSKey = new Buffer('44024241ed4ce9a68c6a8bc055233fd3', 'hex');
console.log("MIC check=" + (lora_packet.verifyMIC(packet, NwkSKey) ? "OK" : "fail"));
 
// calculate MIC based on contents 
console.log("calculated MIC=" + lora_packet.calculateMIC(packet, NwkSKey).toString('hex'));
 
// decrypt payload 
var AppSKey = new Buffer('ec925802ae430ca77fd3dd73cb2cc588', 'hex');
console.log("Decrypted='" + lora_packet.decrypt(packet, AppSKey, NwkSKey).toString() + "'");

 
app.get('/decoder', function (req, res) {
  //res.send('Content-Type: text/html;');
  //res.send('<html>');
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



 


 

 

 