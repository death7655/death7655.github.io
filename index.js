const output = document.getElementById("output");
const name_element = document.getElementById("name");
const email_element = document.getElementById("email");
const password_element = document.getElementById("password");
const dob_element = document.getElementById("dob");
const terms_element = document.getElementById("terms");

const invalid_email = document.getElementById("invalid_email");

const today = new Date();

const minDate = new Date(
  today.getFullYear() - 54,
  today.getMonth(),
  today.getDate()
)
  .toISOString()
  .split("T")[0];

const maxDate = new Date(
  today.getFullYear() - 19,
  today.getMonth(),
  today.getDate()
)
  .toISOString()
  .split("T")[0];

dob_element.min = minDate;
dob_element.max = maxDate;

let table = JSON.parse(localStorage.getItem("table_array"));

function onload() {
  let array = [
    "<tr><th>Name</th><th>Email</th><th>Password</th><th>Dob</th><th>Accepted terms?</th></tr>",
  ];
  if (table == null) {
    localStorage.setItem("table_array", JSON.stringify(array));
    output.innerHTML = array.join("");
  } else {
    output.innerHTML = table.join("");
  }
}

function get_data() {
  let name = name_element.value.trim();
  let email = email_element.value.trim();
  let password = password_element.value.trim();
  let dob = dob_element.value;
  let terms = terms_element.checked;

  table.push(
    `<tr><td>${name}</td><td>${email}</td><td>${password}</td><td>${dob}</td><td>${terms}</td></tr>`
  );

  localStorage.setItem("table_array", JSON.stringify(table));
  output.innerHTML = table.join("");
}
