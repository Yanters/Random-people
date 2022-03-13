let showAdresses = true;

/// Present: first name, last name, picture, register date, nationality, and location address.
//https://randomuser.me/api/
async function getapi(
  url = `https://randomuser.me/api/?inc=name,registered,picture,nat${
    showAdresses ? ",location" : ""
  }&noinfo`
) {
  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  var data = await response.json();
  var formatedData = data.results[0];
  updatePeopleList(formatedData);
  show(formatedData);
}

function show(data) {
  let {
    name: { first },
    name: { last },
    picture: { large: pictureURL },
    registered: { date: registerDate },
    nat: nationality,
  } = data;

  if (showAdresses) {
    var {
      location: { country },
      location: { city },
      location: {
        street: { name: streetName },
      },
      location: {
        street: { number: streetNumber },
      },
    } = data;
  }

  let tab = `
        <div class="card">
        <img src="${pictureURL}" alt="Person" class="card__image""/>
        <p class="card__name">${first} ${last}</p>
        <p class="card__info">🗺️: ${nationality}</p>
        <p class="card__info">📅: ${formatDate(registerDate)}</p>
          ${
            showAdresses
              ? '<p class="card__info" style="margin: 10px 20px; text-align: center">📍: ' +
                country +
                ", " +
                city +
                ", " +
                streetName +
                " " +
                streetNumber +
                "</p>"
              : ""
          }

        `;

  // Setting innerHTML as tab variable
  document.querySelector("#MainCard").innerHTML = tab;
}
// 0 - no sorting, 1 - sort by last name, 2 - sort by register data, 3 - sort by both
var sortType = 0;

function changeState(clickedId) {
  // Get the checkbox
  var checkBox = document.getElementById(clickedId);
  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    showAdresses = false;
    if (clickedId == "lastncb") sortType++;
    if (clickedId == "registercb") sortType += 2;
  } else {
    showAdresses = true;
    if (clickedId == "lastncb") sortType--;
    if (clickedId == "registercb") sortType -= 2;
  }
  if (clickedId != "checkbox") displayPeopleList();
}

function getPeopleList() {
  return JSON.parse(localStorage.getItem("peopleList") || "[]");
}

function formatDate(date) {
  formatedDate = new Date(date);
  formatedDate = new Date(formatedDate.getTime());
  return formatedDate.toISOString().split("T")[0];
}

function updatePeopleList(data) {
  // Loading
  var people = getPeopleList();
  if (people.length == 10) {
    people.shift();
  }

  people.push(data);

  // Saving
  localStorage.setItem("peopleList", JSON.stringify(people));
}

//Display first name, last name, country, and registration date.
function displayPeopleList() {
  var people = getPeopleList();
  let tab = "";
  //Allow sorting table by last name and registration date.
  if (sortType != 0) {
    people.sort(function (a, b) {
      let NameA = a.name.last.toUpperCase(),
        NameB = b.name.last.toUpperCase(),
        DateA = formatDate(a.registered.date);
      DateB = formatDate(b.registered.date);
      //Sort by last name
      if (sortType != 2) {
        return NameA == NameB
          ? sortType == 3
            ? DateA > NameB
              ? 1
              : -1
            : 0
          : NameA > NameB
          ? 1
          : -1;
      } else {
        return DateA == DateB ? 0 : DateA > DateB ? 1 : -1;
      }
    });
  }

  people.forEach(function (user, index) {
    var registerDate = formatDate(user.registered.date);
    tab += `
    <div class="card">
    <img src="${user.picture.large}" alt="Person" class="card__image"/>
      <p class="card__name">${user.name.first} ${user.name.last}</p>
      <p class="card__info">🗺️: ${
        user.location?.country ? user.location.country : "Unknown"
      }</p>
      <p class="card__info">📅: ${registerDate}</p>
    </div>`;
  });
  if (people.length != 0) document.querySelector(".container").innerHTML = tab;
}
