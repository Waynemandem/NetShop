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




