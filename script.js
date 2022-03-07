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
  console.log(data);
  updatePeopleList(formatedData);
  show(formatedData);
  // displayPeopleList();
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

  /*
  `
    <div class="card">
    <img src="${user.picture.large}" alt="Person" class="card__image"/>
      <p class="card__name">${user.name.first} ${user.name.last}</p>
      <p class="card__info">🗺️: ${user.nat}</p>
      <p class="card__info">📅: ${registerDate}</p>
    </div>`
  */
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
  document.querySelector("#test").innerHTML = tab;
}
// 0 - no sorting, 1 - sort by last name, 2 - sort by register data, 3 - sort by both
var sortType = 0;

function changeState(clickedId) {
  // Get the checkbox
  console.log(clickedId);
  var checkBox = document.getElementById(clickedId);
  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    showAdresses = false;
    if (clickedId == "lastncb") sortType++;
    if (clickedId == "registercb") sortType += 2;
    console.log("sort: ", sortType);
  } else {
    showAdresses = true;
    if (clickedId == "lastncb") sortType--;
    if (clickedId == "registercb") sortType -= 2;
    console.log("sort: ", sortType);
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
      let x = a.name.last.toUpperCase(),
        y = b.name.last.toUpperCase(),
        z = formatDate(a.registered.date);
      c = formatDate(b.registered.date);
      console.log(z, c);
      //Sort by last name
      if (sortType != 2) {
        return x == y ? (sortType == 3 ? (z > y ? 1 : -1) : 0) : x > y ? 1 : -1;
      } else {
        return z == c ? 0 : z > c ? 1 : -1;
      }
    });
  }

  people.forEach(function (user, index) {
    var registerDate = formatDate(user.registered.date);

    tab += `
    <div class="card">
    <img src="${user.picture.large}" alt="Person" class="card__image"/>
      <p class="card__name">${user.name.first} ${user.name.last}</p>
      <p class="card__info">🗺️: ${user.nat}</p>
      <p class="card__info">📅: ${registerDate}</p>
    </div>`;
  });
  document.querySelector(".container").innerHTML = tab;
}
