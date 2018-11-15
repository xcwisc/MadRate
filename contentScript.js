function main(){
  const URL = "https://www.ratemyprofessors.com/search.jsp?queryBy=schoolId&schoolName=University+of+Wisconsin+-+Madison&schoolID=1256&query=";

  let instructorTagArr = document.querySelectorAll('.section-info.section-info__instructor.capitalize');
  let instructorNameArr = getInstructorList(instructorTagArr, URL);

  function getInstructorList(instructorTagArr, URL) {
    let parsedArr = [];
    for (let i = 0; i < instructorTagArr.length; i++) {
      if (instructorTagArr[i].firstElementChild) {
        let instructorName = instructorTagArr[i].firstElementChild.innerText;
        parsedArr.push(URL + instructorName.split(" ").join("+"));
      } else {
        parsedArr.push("");
      }
    }
    return parsedArr;
  }

  function searchForProfessor(instructorName, instructorTag) {
    chrome.runtime.sendMessage({
        action: "searchForProfessor",
        url: instructorName
    }, function(response) {
        if (response.link) {
          getOverallScore(response.link, instructorTag);
        } else {
          let addOn = "(RMP score: N/A)"
          instructorTag.firstElementChild.innerText += addOn;
        }
    })
  }

  function getOverallScore(url, instructorTag) {
      chrome.runtime.sendMessage({
        action: "getProfessorScore",
        url: url
    }, function(response) {
      if (response.score) {
        renderChange(instructorTag, response.score, url);
      } else {
        renderChange(instructorTag, "N/A", url);
      }
    })
  }

  function renderChange(instructorTag, score, url) {
    let addOn = "(RMP score: " + score + ")"
    instructorTag.firstElementChild.innerText += addOn;
    if (score === "N/A") {
      return;
    }
    // console.log("https://www.ratemyprofessors.com" + url);
    instructorTag.firstElementChild.href = "https://www.ratemyprofessors.com" + url;
    let bgColor;
    if (score >= 3.5) {
      bgColor = '#a8d888';
    } else if (score >= 2.5) {
      bgColor = '#d8ce87';
    } else {
      bgColor = '#d88787';
    }
    instructorTag.style.backgroundColor = bgColor;
  }

  function start() {
    for (let i = 0; i < instructorNameArr.length; i++) {
      if (instructorNameArr[i] != "") {
        searchForProfessor(instructorNameArr[i], instructorTagArr[i]);
      }
    }
  }

  return {
    render: () => {
      start();
    }
  }
};


main().render();
