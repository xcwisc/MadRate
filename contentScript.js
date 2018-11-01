const URL = "https://www.ratemyprofessors.com/search.jsp?queryBy=schoolId&schoolName=University+of+Wisconsin+-+Madison&schoolID=1256&query=";
const Colors = ['#a8d888', '#d8ce87', '#d88787'];
// let instructorTag = document.querySelector('.section-info__instructor').firstElementChild;
// let instructorName = instructorTag.innerText;
// let instructorNames = instructorName.split(" ");
// let query = URL + instructorNames.join("+");

let instructorTagArr = document.querySelectorAll('.section-info.section-info__instructor.capitalize');
let instructorNameArr = getInstructorList(instructorTagArr);
for (let i = 0; i < instructorNameArr.length; i++) {
  if (instructorNameArr[i] != "") {
    searchForProfessor(instructorNameArr[i], instructorTagArr[i]);
  }
}


function getInstructorList(instructorTagArr) {
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
    bgColor = Colors[0];
  } else if (score >= 2.5) {
    bgColor = Colors[1];
  } else {
    bgColor = Colors[2];
  }
  instructorTag.style.backgroundColor = bgColor;
}

