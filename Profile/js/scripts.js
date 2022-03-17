/*!
* Start Bootstrap - Modern Business v5.0.4 (https://startbootstrap.com/template-overviews/modern-business)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-modern-business/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project



// let userId = sessionStorage.getItem("userId");
// let userId = "User1";
// var user1 = firebase.database().ref("users").child(userId);


// for group's firebase //
let profileId = sessionStorage.getItem("profileID");
let loggedInID=sessionStorage.getItem("userID");
// 
// userId.once('value').then((snapshot)=> {
if(document.getElementById("loginNav") != null){
    if(loggedInID == null){
        document.getElementById("loginNav").style.display = "none";
        document.getElementById("noLoginNav").style.display = "block";
    }
    else{
        document.getElementById("loginNav").style.display = "block";
        document.getElementById("noLoginNav").style.display = "none";
    }
}


// })
if(profileId !=  loggedInID){
    var userId = firebase.database().ref("users/" + profileId );
}
else{ 
    var userId = firebase.database().ref("users/" + loggedInID );
}
userId.once('value').then((snapshot)=>{

    /////////// USER ID = LOGIN ID ? //////////////
    if(profileId != loggedInID){
        document.getElementById("edit").style.display = "none";
    }

    if(document.getElementById("onlyfortutees") != null){
        if(sessionStorage.getItem("userType") != "Tutor"){
            document.getElementById("onlyfortutees").style.display = "block";
        }
    }

    var name = snapshot.val().name;


    var user_type = snapshot.val().userType;

    if(document.getElementById("calenderbtn") != null){
        var calenderlink = snapshot.val().calendar;
        document.getElementById("calenderbtn").href = calenderlink;
    }
 

    ////////////// NAME /////////////////
    document.getElementById("name").innerHTML= name;
    // document.getElementById("welcome").innerHTML = "Welcome, " + name;

    document.getElementById("welcome").innerHTML = name;


    //////////// USER TYPE ///////////////
    document.getElementById("type").innerHTML = user_type;


    ////////////// AGE /////////////////
    var age = snapshot.val().age;
    document.getElementById("age").innerHTML = age;
    

    ////////////// EMAIL /////////////////
    var email = snapshot.val().email;
    document.getElementById("email").innerHTML = email;


    ////////////// NUMBER /////////////////
    var number = snapshot.val().phone;
    document.getElementById("number").innerHTML = number;


    ////////////// GENDER /////////////////
    var gender = snapshot.val().gender;
    document.getElementById("gender").innerHTML = gender;


    ////////////// DESCRIPTION /////////////////
    var about = snapshot.val().description;
    document.getElementById("about").innerHTML = about;


    ////////////// ADDRESS /////////////////
    var location = snapshot.val().address;
    var postal = snapshot.val().postal;
    document.getElementById("address").innerHTML = location +" Singapore " + postal ; 


    /////////////// RATE /////////////////
    if( user_type==="Tutor") {
        var rate = snapshot.val().rate;
        document.getElementById("rate").innerHTML = rate;
    }


    /////////////// SUBJECTS //////////////////
    var subject = snapshot.val().subjects;

    let ul = document.createElement("ul");
    for (const sub in subject) {
        if (Object.hasOwnProperty.call(subject, sub)){
            const level = subject[sub];
            let li = document.createElement("li");
            li.innerText = level
            ul.append(li)
        }
    }
    document.getElementById("subjects").append(ul)
    

    /////////////// QUALIFICATIONS /////////////////////
    
    if( user_type==="Tutor"){
        var qualification = snapshot.val().qualifications;

    let ul_1 = document.createElement("ul");
    for (const qual in qualification){
        if (Object.hasOwnProperty.call(qualification, qual)){
            const grade = qualification[qual];
            let li_1 = document.createElement("li");
            li_1.innerText = qual +": "+grade;
            ul_1.append(li_1); 
        }
    }
        document.getElementById("qualifications").append(ul_1)
    }


    //////////// LANGUAGES ////////////////
    var language = snapshot.val().languages;

    
    let ul_2 = document.createElement("ul");
    for (const lang in language){
        if (Object.hasOwnProperty.call(language, lang)){
            const first_lang = language[lang];
            let li_2 = document.createElement("li");
            li_2.innerText = first_lang;
            ul_2.append(li_2); 
        }
    }

    document.getElementById("languages").append(ul_2);


    /////////////// TEACHING LEVEL //////////////////
    if( user_type==="Tutor") {
        var teachinglevel = snapshot.val().teachingLevel;
        document.getElementById("teachinglevel").innerHTML = teachinglevel;
    }

    /////////////// METHOD //////////////////
    // var method = snapshot.val().Method;
    // document.getElementById("method").innerHTML = method;
  
}) 

.catch(error=>{
    if(sessionStorage.length == 0){
        window.location.href = "../Homepage/homepage_no_login.html"
    }
    else if(window.confirm("Please complete your registration first")){
        window.location.href = "../Login/SignUp1.html";
    }
})



///////////// GET IMAGE FROM FIREBASE /////////////////

function retrieveImage(){
    if(profileId !=  loggedInID){
        userId = profileId
    }
    else{
        userId = sessionStorage.getItem("userID")
    }
        const profile = firebase.storage().ref().child("profile");

        profile
            .child(userId + ".jpg")
            .getDownloadURL()
            .then((url) => {

                document.getElementById("image").src=url
   
                
            })
            .catch((error) => {
                document.getElementById("image").src = "https://firebasestorage.googleapis.com/v0/b/wad-mtor.appspot.com/o/profile%2Fdefault.png?alt=media&token=baee6522-1577-455c-848a-7c07609b3063";
            });
    }


function editInfo(){
    if(sessionStorage.getItem("userType") == "Tutor"){
        window.location.href = "../Login/SignUp2.html";
    }
    else{
        window.location.href = "../Login/SignUpTutee2.html";
    }
}


        
// function editInfo(){
//     var name = document.getElementById("name").value;
//     var updates = {};
//     updates['/username/' + username + "/" + 'name'] = name;
//     firebase.database().ref.update(updates);
// }

