document.addEventListener("DOMContentLoaded", function() {
  let tableBody = document.getElementById("user-table-body");
  let storedUsers = JSON.parse(localStorage.getItem("users")) || [];

  function calculateAge(dob) {
      let birthDate = new Date(dob);
      let today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      let monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      return age;
  }

  function renderTable() {
      tableBody.innerHTML = "";
      storedUsers.forEach(user => {
          let newRow = tableBody.insertRow();
          newRow.insertCell(0).textContent = user.name;
          newRow.insertCell(1).textContent = user.email;
          newRow.insertCell(2).textContent = user.password;
          newRow.insertCell(3).textContent = user.dob;
          newRow.insertCell(4).textContent = user.acceptedTerms;
      });
  }

  document.getElementById("registration-form").addEventListener("submit", function(event) {
      event.preventDefault();
      
      let name = document.getElementById("name").value;
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      let dob = document.getElementById("dob").value;
      let acceptedTerms = document.getElementById("accepted-terms").checked ? "true" : "false";
      
      let age = calculateAge(dob);
      if (age < 18 || age > 55) {
          alert("Age must be between 18 and 55 years.");
          return;
      }
      
      let newUser = { name, email, password, dob, acceptedTerms };
      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      
      renderTable();
      this.reset();
  });
  
  renderTable();
});
