let rate_it = document.getElementById('changeColor');

rate_it.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'contentScript.js'});
  });
};