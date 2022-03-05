const randomBetween = (min, max) =>
  min + Math.floor(Math.random() * (max - min + 1));

function random_rgba() {
  const r = randomBetween(0, 255);
  const g = randomBetween(0, 255);
  const b = randomBetween(0, 255);
  const rgb = `rgb(${r},${g},${b})`;
  return rgb;
}

function random_size() {}

const randomize = () => {
  choosenDiv.setAttribute(
    "style",
    `color: ${random_rgba()}; font-size:${randomBetween(5, 80)}px`
  );
};

/// Present: first name, last name, picture, register date, nationality, and location address.
async function getapi(url = "https://randomuser.me/api/") {
  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  var data = await response.json();
  var formatedData = data.results[0];
  console.log(data);
  console.log(
    data.results[0].name.first,
    data.results[0].name.last,
    data.results[0].picture.medium,
    data.results[0].registered.date,
    data.results[0].nat,
    data.results[0].location.country,
    data.results[0].location.city,
    data.results[0].location.street.name,
    data.results[0].location.street.number
  );
  show(formatedData);
}

function show(data) {
  let {
    name: { first },
    name: { last },
    picture: { medium: pictureURL },
    registered: { date: registerDate },
    nat: nationality,
    location: { country },
    location: { city },
    location: {
      street: { name: streetName },
    },
    location: {
      street: { number: streetNumber },
    },
  } = data;

  let tab = `
        <img src="${pictureURL}"/>
        <ul>
          <li>First Name: ${first}</li>
          <li>Last Name: ${last}</li>
          <li>Register Date: ${registerDate}</li>
          <li>Nationality: ${nationality}</li>
          <li id="location">Location: ${country}, ${city}, ${streetName} ${streetNumber}</li>
          <input type="checkbox" id="checkbox" onclick="hideLocationInfo()">Hide Address</input>
        </ul>`;

  // Setting innerHTML as tab variable
  document.querySelector("#test").innerHTML = tab;
}

function hideLocationInfo() {
  // Get the checkbox
  var checkBox = document.getElementById("checkbox");
  // Get the output text
  var locationText = document.getElementById("location");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true) {
    locationText.style.display = "none";
  } else {
    locationText.style.display = "";
  }
}
