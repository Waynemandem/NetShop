document.addEventListener("DOMContentLoaded",()=> {
      const businesses = [
        { name: "Mumsy's Kitchen", category:
             "Food", contact: "09078740445" },
        { name: "FinoCutz", category:
            "Fashion", contact: "09078740445" },
        { name:"Wayne tech laptop repair", category:
            "Tech", conatct: "09078740445" },
        { name: "Teena crochet", category: 
            "fashion", contact: "09078740445" },
        { name: "Beauty's place", category:
            "E-commerce store", contact: "09078740445"},
        { name: "B&B fashion Hub", category:
            "fashion", contact: "09078740445" }  
      ];

      const listContainer =
      document.getElementById("liofbusiness");

      if (listContainer){
           businesses.forEach(biz => {
            const card = 
            document.createElement("div");
             card.className = "card";
             card.innerHTML = `<h3>${biz.name}</h3>
                               <p>category: ${biz.category}</p>
                               ${biz.contact}`;

               listContainer.appendChild(card);                
           });
      }
});

    function addCourse() {
      let courseDiv = document.createElement("div");
      courseDiv.classList.add("course");
      courseDiv.innerHTML = `
        <select class="grade">
          <option value="5">A</option>
          <option value="4">B</option>
          <option value="3">C</option>
          <option value="2">D</option>
          <option value="1">E</option>
          <option value="0">F</option>
        </select>
        <input type="number" class="credit" placeholder="Credit" min="1">
      `;
      document.getElementById("courses").appendChild(courseDiv);
    }

    function calculateGPA() {
      let grades = document.querySelectorAll(".grade");
      let credits = document.querySelectorAll(".credit");

      let totalPoints = 0;
      let totalCredits = 0;

      for (let i = 0; i < grades.length; i++) {
        let gradeValue = parseFloat(grades[i].value);
        let creditValue = parseFloat(credits[i].value);

        if (!isNaN(creditValue)) {
          totalPoints += gradeValue * creditValue;
          totalCredits += creditValue;
        }
      }

      if (totalCredits === 0) {
        document.getElementById("result").innerText = "Enter at least one course credit.";
      } else {
        let gpa = (totalPoints / totalCredits).toFixed(2);
        document.getElementById("result").innerText = "Your GPA is: " + gpa;
      }
    }