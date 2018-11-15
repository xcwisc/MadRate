chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'enroll.wisc.edu'},
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  if (req.action === "searchForProfessor") {
    fetch(req.url, {
      header: new Headers({
        'Access-Control-Allow-Origin':'*',
        'Content-Type': 'multipart/form-data'
      })})
      .then((res) => {
        return res.text();
        // console.log(res.text());
      })
      .then((html) => {
        parser = new DOMParser();
        htmlDoc = parser.parseFromString(html, "text/html");
        let link = htmlDoc.querySelector(".listing.PROFESSOR");
        if (link) {
          let schoolName = link.querySelector(".sub").innerText;
          // console.log(schoolName);
          if (schoolName.includes("University of Wisconsin - Madison")) {
            link = link.getElementsByTagName("a")[0].getAttribute("href");
          } else {
            link = null;
          }
        }
        // console.log(link);
        sendResponse({link: link});
      })
      .catch(error => console.error('Error:', error));
    return true;
  } else if (req.action === "getProfessorScore") {
    fetch("https://www.ratemyprofessors.com" + req.url)
      .then((res) => {
        return res.text();
      })
      .then((html) => {
        parser = new DOMParser();
        htmlDoc = parser.parseFromString(html, "text/html");
        let link = htmlDoc.querySelector(".breakdown-container.quality");
        if (link) {
          link = link.querySelector(".grade").innerText;
        }
        console.log(link);
        sendResponse({score: link});
      })
      .catch(error => console.error('Error:', error));
    return true;
  }
});
