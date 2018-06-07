
chrome.extension.onRequest.addListener(function(data, sender) {
  if (data.length > 0) {

    // console.log("Send Message here.");

    // this code sends the browser tab's message to the python application .py file
    chrome.runtime.sendNativeMessage("com.vbas.colorhunt_colorizer", { colorInfo : data }, function(response) {

			var resultMsg;
      if (chrome.runtime.lastError) {
				resultMsg = chrome.runtime.lastError.message;
      } else {
        resultMsg = response;
      }

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { resultMsg : resultMsg });
      });

    });
  }
});