const output = document.getElementById("output");
const name_element = document.getElementById("name");
const email_element = document.getElementById("email");
const password_element = document.getElementById("password");
const dob_element = document.getElementById("dob");
const terms_element = document.getElementById("terms");

const invalid_email = document.getElementById("invalid_email");

const today = new Date();

function check_email(email) {
  let email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email_regex.test(email)) {
    invalid_email.innerText = "Please enter a valid email";
    setTimeout(() => { invalid_email.innerText = ""; }, 2000);
    return false;
  }
  return true;
}

function onload() {
  let table = JSON.parse(localStorage.getItem("table_array"));
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

  let dob_date = new Date(dob);
  let age = today.getFullYear() - dob_date.getFullYear();
  let monthDiff = today.getMonth() - dob_date.getMonth();
  let dayDiff = today.getDate() - dob_date.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  let valid_email = check_email(email);
  let valid_age = age >= 18 && age <= 55;
  let valid_input = true;

  let class_add = "border_red";

  // Reset validation
  name_element.classList.remove(class_add);
  email_element.classList.remove(class_add);
  password_element.classList.remove(class_add);
  dob_element.classList.remove(class_add);

  if (name === "") {
    name_element.classList.add(class_add);
    valid_input = false;
  }
  if (!valid_email) {
    email_element.classList.add(class_add);
    valid_input = false;
  }
  if (password === "") {
    password_element.classList.add(class_add);
    valid_input = false;
  }
  if (!valid_age) {
    dob_element.classList.add(class_add);
    valid_input = false;
  }

  if (valid_input && terms && valid_age) {
    let table = JSON.parse(localStorage.getItem("table_array"));

    table.push(
      `<tr><td>${name}</td><td>${email}</td><td>${password}</td><td>${dob}</td><td>${terms}</td></tr>`
    );

    localStorage.setItem("table_array", JSON.stringify(table));
    output.innerHTML = table.join("");
  }
}
