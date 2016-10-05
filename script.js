function getZonkyToken() {
  
  var payload = 'username=XXX&password=XXX&grant_type=password&scope=SCOPE_APP_WEB'; 
var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic d2ViOndlYg=='
  
    
};
var url = 'https://api.zonky.cz/oauth/token';
var options = {
    'method': 'post',
  'headers' : headers,
  'payload' : payload
};
var response = UrlFetchApp.fetch(url, options);
  var tokenResponse = JSON.parse(response);
   
  //store the token for later retrival
  //UserProperties.setProperty(tokenPropertyName, tokenResponse.access_token);
  
//Logger.log(tokenResponse);
  
  return tokenResponse.access_token
}


function getZonkyTransactions() {
  
  
  var token = getZonkyToken();
  

var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Bearer '+ token,
  'X-Size' : '1000'
  
    
};
var url = 'https://api.zonky.cz/users/me/wallet/transactions';
var options = {
    'method': 'get',
    'headers' : headers
  
};
var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response);
   
  //store the token for later retrival
  //UserProperties.setProperty(tokenPropertyName, tokenResponse.access_token);
  
//Logger.log(json);
  
  return json;
  
}


function postRecordWallet(body){
  
  var headers = {
  'Content-Type': 'application/json',
  'X-Token' : 'XXX',
  'X-User': 'XXX'
};
var url = 'https://api.budgetbakers.com/api/v1/records-bulk';
var options = {
    'method': 'post',
    'headers': headers,
    'payload' : JSON.stringify(body),
  'muteHttpExceptions' : true
  
};
var response = UrlFetchApp.fetch(url, options);
  
Logger.log(response);
  

}


function createRecordWallet() {

  
  var json = getZonkyTransactions();
  var data = getWalletRecords();
              
  var notInTransactions = true;

  for(var x in json){
  
  var amount =0;
    
    if (json[x].transactionDate == null) continue;
    
  
  if(json[x].orientation === 'OUT') amount = json[x].amount * -1;
  else amount = json[x].amount;
  
  var body = 
  [{
    'categoryId': 'XXX', 
    'accountId': 'XXX', 
    'currencyId': 'XXX', 
    'amount': amount,
    'paymentType': 'web_payment',
    'date': json[x].transactionDate,
    'note': json[x].category + " - " + json[x].loanName + " - " +json[x].transactionDate.substring(0, 10),
    'recordState': 'cleared'
  }]
  ;
  
  
    
    for (var y in data){
  var y_day = new Date(data[y].date.substring(0, 23) + "Z");
      y_day.setHours ( y_day.getHours() + 2 );
      var x_day = new Date(body[0].date.substring(0, 23) + "Z");
      
      
      
      if (body[0].note === data[y].note && body[0].amount === data[y].amount){
     
  notInTransactions = false;
      }
  
  } 
    
    if (notInTransactions) {
      //Logger.log(body);
      postRecordWallet(body);
      }
    
    
}
 
}


function getWalletRecords() {

  
  
var headers = {
  'X-Token' : 'XXX',
  'X-User': 'XXX'
   
};
var url = 'https://api.budgetbakers.com/api/v1/records';
var options = {
    'method': 'get',
    'headers': headers
};
var response = UrlFetchApp.fetch(url, options);
  
  
  var data = JSON.parse(response);
  
return data;
  

}
