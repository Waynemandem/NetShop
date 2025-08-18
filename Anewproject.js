document.addEventListener("DOMContentLoaded",()=> {
      const businesses = [
        { name: "Mumsy's Kitchen", category:
             "Food", contact: "09078740445" },
        { name: "FinoCutz", category:
            "Fashion", contact: "09078740445" },
        { name:"Wayne tech laptop repair", category:
            "Tech", conatct: "09078740445" },
        { name: "Teena crochet", category: 
            "fashion", contact: "09078740445" }             
      ];

      const listContainer =
      document.getElementById("liofbusiness");

      if (listContainer){
           businesses.forEach(biz => {
            const card = 
            document.createElement("div");
             card.className = "card";
             card.innerHTML = `<h3>${bizname}</h3>
                               <p>category: ${biz.category}</p>
                               <p>contact</p>`;

               listContainer.appendChild(card);                
           });
      }
})
