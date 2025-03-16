const output = document.getElementById("output");
const name_element = document.getElementById("name");
const email_element = document.getElementById("email");
const password_element = document.getElementById("password");
const dob_element = document.getElementById("dob");
const terms_element = document.getElementById("terms");

const invalid_email = document.getElementById("invalid_email");

const today = new Date();

const minDate = new Date(
  today.getFullYear() - 55,
  today.getMonth(),
  today.getDate()
)
  .toISOString()
  .split("T")[0];

const maxDate = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
)
  .toISOString()
  .split("T")[0];

dob_element.min = minDate;
dob_element.max = maxDate;

function check_email(string) {
  let at = string.includes("@");
  let com = string.includes(".com");
  if (at && com) {
    return true;
  } else if (at) {
    invalid_email.innerText = "Please include a valid build";
  } else {
    invalid_email.innerText = "Please include an @";
  }
  setTimeout(() => {
    invalid_email.innerText = "";
  }, 2000);
  return false;
}

function get_local_storage() {
  let table = JSON.parse(localStorage.getItem("table_array"));
  let array = [
    "<tr><th>Name</th><th>Email</th><th>Password</th><th>Dob</th><th>Accepted terms?</th></tr>",
  ];
  if (table == null) {
    localStorage.setItem("table_array", JSON.stringify(array));
    output.innerHTML = array;
  } else {
    output.innerHTML = table;
  }
}

function get_data() {
  let name = name_element.value;
  let email = email_element.value;
  let password = password_element.value;
  let dob = dob_element.value;
  let terms = terms_element.checked;

  let class_add = "border_red";

  let valid_email = check_email(email);
  let valid_input = false;

  let table = JSON.parse(localStorage.getItem("table_array"));

  if (name != "") {
    name_element.classList.remove(class_add);
    valid_input = true;
  }
  if (email != "" && valid_email == true) {
    email_element.classList.remove(class_add);
    valid_input = true;
  }
  if (dob != "") {
    dob_element.classList.remove(class_add);
    valid_input = true;
  }
  if (password != "") {
    password_element.classList.remove(class_add);
    valid_input = true;
  }

  if (name == "") {
    name_element.classList.add(class_add);
    valid_input = false;
  }
  if (email == "" || valid_email == false) {
    email_element.classList.add(class_add);
    valid_input = false;
  }
  if (password == "") {
    password_element.classList.add(class_add);
    valid_input = false;
  }
  if (dob == "") {
    dob_element.classList.add(class_add);
    valid_input = false;
  }

  if (valid_input && terms) {
    table[0] +=
      "<tr><td>" +
      name +
      "</td>" +
      "<td>" +
      email +
      "</td>" +
      "<td>" +
      password +
      "</td>" +
      "<td>" +
      dob +
      "</td>" +
      "<td>" +
      terms +
      "</td></tr>";
    localStorage.setItem("table_array", JSON.stringify(table));
    output.innerHTML = table;
  }
}
