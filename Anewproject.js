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

//ternary operator and conditional statement//

//let age = 19;
//let message = age >= 18 ? "you are an adult" : "you re a minor";
//console.log(message);

let purchaseamt = 210;
let discount = purchaseamt >= 100? "10% discount" : "no discount";
console.log(discount);

let year = 42;
let marriage = year >= 40 ? "you're eliglible to marry" : "remain single";
console.log(marriage);

//let user = 15;
//let allowed = user >= 18 ? "confirm" : "not confirm please verify";
//alert(allowed);

//if statement//
//let age = 13;

//if(age >= 18){
 //    console.log('you are welcome to my domain');
//}
//else{
 //   console.log('you are not welcome');
//};

let time = 13;

if (time < 12) {
    console.log('Good morning!');
}
else{
    console.log('Good afternoon!');
};


let isStudent = false;

if (isStudent) {
    console.log('you are a student');
}
else{
    console.log('you are not a student!');
};

// nested if statement//
const myText = document.getElementById("myText");
const mySubmit = document.getElementById("mySubmit");
const resultElement = document.getElementById("resultElement");
let age;

mySubmit.onclick = function(){

 age = myText.value; 
 age = Number(age);

 if(age >= 100) {
     resultElement.textContent = `you are too old to enter this site`;
 }
 else if(age == 0) {
      resultElement.textContent = `you can't enter, you were just born`;
 }
 else if(age >= 18) {
     resultElement.textContent = `you are old enough to enter this site`;
 }
 else if(age < 0){
     resultElement.textContent = `your age can't be below 0`;
 } 
 else{
     resultElement.textContent = `you are not old enough to enter this site`;
 }

}

//for loop

for(i = 0; i < 10; i++){
     console.log(i);
};

for (i = 0; i < 100; i++){
    console.log("the number is" + " " + [i])
};


let hour = 12;

if (hour < 12) {
    console.log('Bed time');
}
else{
    console.log('Hustle time');
};


let date = 24;

if (date < 26) {
    console.log('no salary');
}
else{
    console.log('pay day');
};

let weather = 21;

if (weather < 21) {
    console.log('sunny');
}
if (weather < 25) {
    console.log('cloudy');    
}
else{
    console.log('rainy');
}

const myClass = document.getElementById("myClass");
const myPost = document.getElementById("myPost");
const demo1 = document.getElementById("demo1"); 
let uClass;

myPost.onclick = function () {

    uClass.myClass.value;
    uClass.Number(uClass);
 
  if (uClass == 6) {
    demo1.textContent = `you're in primary school`;
  } else if (uClass == 8) {
    demo1.textContent = `you are in junior secondary school`;
  } else if (uClass == 11){
    demo1.textContent = `you are in senior secondary school`;
  }
  else{
    demo1.textContent = `you are in university`;
  }
    
  };

