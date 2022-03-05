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
  show(formatedData);
  updatePeopleList(formatedData);
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
        <img src="${pictureURL}"/>
        <ul>
          <li>First Name: ${first}</li>
          <li>Last Name: ${last}</li>
          <li>Register Date: ${formatDate(registerDate)}</li>
          <li>Nationality: ${nationality}</li>
          ${
            showAdresses
              ? '<li id="location">Location: ' +
                country +
                ", " +
                city +
                ", " +
                streetName +
                " " +
                streetNumber +
                "</li>"
              : ""
          }

        </ul>`;

  // Setting innerHTML as tab variable
  document.querySelector("#test").innerHTML = tab;
}

function hideLocationInfo() {
  // Get the checkbox
  var checkBox = document.getElementById("checkbox");
  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    showAdresses = false;
  } else {
    showAdresses = true;
  }
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

  //Display first name, last name, country, and registration date.
  let tab = "";
  people.forEach(function (user, index) {
    var registerDate = formatDate(user.registered.date);

    tab += `
    <div>
    <h3>${index + 1}.</h3>
    <img src="${user.picture.large}"/>
    <ul>
      <li>First Name: ${user.name.first}</li>
      <li>Last Name: ${user.name.last}</li>
      <li>Register Date: ${registerDate}</li>
      <li>Nationality: ${user.nat}</li>
    </ul>
    <div>`;
  });
  document.querySelector("#other").innerHTML = tab;
}
