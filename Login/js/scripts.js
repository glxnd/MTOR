

  const firebaseConfig = {
      apiKey: "AIzaSyBee5mbaSxk1JnnIHlkZxx4bwdtP0HY5g0",
      authDomain: "wad-mtor.firebaseapp.com",
      databaseURL: "https://wad-mtor-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "wad-mtor",
      storageBucket: "wad-mtor.appspot.com",
      messagingSenderId: "908590207014",
      appId: "1:908590207014:web:f1b1ab657d1a2bffe296e7"
    };
  window.sessionStorage;
  

// -----------------------------------------CHECK FIREBASE DATABASE INFORMATION AND PREFILL INTO PROFILE INPUT VALUES------------------------------
  function checkdatabaseinfo(uid) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    var user = firebase.database().ref('users/' + uid);
    user.once('value').then((snapshot) => {
      if(snapshot.exists()) {
        for(var i in snapshot.val()){
          var x = snapshot.val()[i];
          if(typeof x === "object"){
            var y = JSON.stringify(x);
            sessionStorage.setItem(i,y);
          }
          
          else{
          sessionStorage.setItem(i,snapshot.val()[i]);
          }
        }
      }
      else {
        console.log("Leave empty");
      }
    });
  }

 // --------------------------------------------------------------------Google Login -------------------------------------------------------
  function googlelogin(){
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  firebase.auth().signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;
    var token = credential.accessToken;
    var user = result.user;
    console.log(user);
    sessionStorage.setItem("loggedin","true");
    checkdatabaseinfo(user.uid);
    sessionStorage.setItem("name", user.displayName);
    sessionStorage.setItem("email", user.email);
    sessionStorage.setItem("userID", user.uid);

    
    }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
    alert(errorMessage);
  });

}

// ----------------------------------------SAVING INFORMATION INTO FIREBASE REALTIME DATABASE-------------------------------------
function register() {
  
  var userType = sessionStorage.getItem("userType");
  var name = sessionStorage.getItem("name");
  var gender = sessionStorage.getItem("gender");
  var age = sessionStorage.getItem("age");
  var email = sessionStorage.getItem("email");
  var phone = sessionStorage.getItem("phone");
  var tempaddress = sessionStorage.getItem("address")
  var address = tempaddress.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase());
  var postal = sessionStorage.getItem("postal");
  var description = sessionStorage.getItem("description");
  var languages = sessionStorage.getItem("languages");
  
  var rate = sessionStorage.getItem("rate");
  var qualifications = sessionStorage.getItem("qualifications");
  var subjects = sessionStorage.getItem("subjects");
  var teachingLevel = sessionStorage.getItem("teachingLevel")
  var calendar = sessionStorage.getItem("calendar");
  var uid = sessionStorage.getItem("userID");

  writeUserDataWithCompletion(userType,name,gender,age,email,phone,address,postal,description,languages,rate,qualifications,subjects,teachingLevel,calendar,uid);
}

function writeUserDataWithCompletion(userType,name,gender,age,email,phone,address,postal,description,languages,rate,qualifications,subjects,teachingLevel,calendar,uid) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    
  }

  if(userType == "Tutor"){
    firebase.database().ref('users/' + uid).set({
      userType: userType,
      name:name,
      gender:gender,
      age:age,
      email: email,
      phone:phone,
      address:address,
      postal:postal,
      description:description,
      languages: JSON.parse(languages),
      rate: rate,
      qualifications: JSON.parse(qualifications),
      subjects: JSON.parse(subjects),
      teachingLevel: teachingLevel,
      calendar:calendar,
      online: true
    }, (error) => {
      if(error){
        alert("Data was not updated")
      }
      else{
        alert("Your information has been saved successfully.")
      }
    })
  }
  else if(userType == "Tutee"){
    firebase.database().ref('users/' + uid).set({
      userType: userType,
      name:name,
      gender:gender,
      age:age,
      email: email,
      phone:phone,
      address:address,
      postal:postal,
      description:description,
      languages: JSON.parse(languages), 
      rate: rate,
      qualifications: JSON.parse(qualifications),
      online: true
  }, (error) => {
    if(error){
      alert("Data was not updated")
    }
    else{
      alert("Your information has been saved successfully.")
    }
  })
}

}


function writeimg(uid,image){
  console.log(image);
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  firebase.storage().ref().child('profile/' + uid+".jpg" ).put(image)
  .then((snapshot)=>{
    console.log("success")
  })
  .catch((error) =>{
    console.log(error.message)
  })
  }
  



// ------------------------------------------------TEMPORARY STORING OF EDITED INFORMATION INTO SESSION STORAGE----------------------------
function savedata(obj){
  var item = obj.id;
  var itemvalue = document.getElementById(item).value;
  sessionStorage.setItem(item, itemvalue);
}


function savedatabtns(obj){
  var itemvalue = obj.value;
  var item = obj.name;
  sessionStorage.setItem(item, itemvalue);

  if(sessionStorage.getItem("userType") && document.getElementById("usertypepage")){
    var form = document.getElementById("usertypepage");
    var usert = sessionStorage.getItem("userType");
    if(usert == "Tutee"){
      form.setAttribute("action","SignUpTutee2.html");
    }
    else if(usert == "Tutor"){
      form.setAttribute("action","SignUp2.html")
      }
    }
  }


function savedatalist(obj){
  var item = obj.id;
  var itemvalue = document.getElementById(item).value;
  itemvalue = itemvalue.split(",");
  var finallist = [];
  for(var i = 0; i<itemvalue.length;i++){
      finallist.push(itemvalue[i].trim())
    }
  console.log(finallist);
  sessionStorage.setItem(item,JSON.stringify(finallist));
  console.log(JSON.parse(sessionStorage.getItem(item)))
  
  }


  function savedataimg(){
    var uid = sessionStorage.getItem("userID");
    console.log(event.target.files);
    var im = event.target.files[0];
    var uid = sessionStorage.getItem("userID");
    writeimg(uid,im);
    

  }

// --------------------------------------------------------------------QUALIFICATION STUFF---------------------------------------------------

function addmore(){
  var ingrp = document.createElement("div");
  ingrp.setAttribute("class","input-group");
  var ingrptext = document.createElement("span");
  ingrptext.setAttribute("class","input-group-text");
  var inp1 = document.createElement("input");
  inp1.name = "qualikey";
  inp1.type = "text";
  inp1.setAttribute("class", "form-control")
  inp1.placeholder = "Exam E.G. oLevels(L1R5)";
  inp1.addEventListener("change",getqualification);
  ingrptext.append(inp1);
  ingrp.append(ingrptext);
  var inp2 = document.createElement("input");
  inp2.name = "qualivalue";
  inp2.type = "text";
  inp2.setAttribute("class", "form-control");
  inp2.placeholder = "Results";
  inp2.addEventListener("change",getqualification);
  ingrp.append(inp2);
  document.getElementById("addquali").append(ingrp);
}

function getqualification(){
  var qualkey = document.getElementsByName("qualikey")
  var qualval = document.getElementsByName("qualivalue");
  var qual = {}
  for(var i = 0; i < qualkey.length; i ++){

    if(qualkey[i].value != "" && qualval[i].value != ""){
      qual[qualkey[i].value] = qualval[i].value
    }
  }
  sessionStorage.setItem("qualifications", JSON.stringify(qual))
    
  }

// ---------------------------------ONLOAD FOR SIGNUP1,2&3 TO FILL UP INPUT VALUES WITH TEMPORARY SESSION STORAGE VALUES--------------------------
function checkIfUser(userID){
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  userDB = firebase.database().ref("users");
  userDB.child(userID).get().then((snapshot)=>{
    if(snapshot.exists()){
      document.getElementById("prev").style.display = "none"
    }
  }
  )
}
function checkdata(obj){
  var form = document.getElementById("contactForm");
  var leng = form.getElementsByTagName("input");
  var user = sessionStorage.getItem("userID")
  // For BUTTON INPUTS
  for(var i = 0; i< leng.length; i++){
    if(leng[i].name){
      var item = leng[i].name
      if(sessionStorage.getItem(item)){
        var val = sessionStorage.getItem(item)
        document.getElementById(val).click()
      }
    }
    // For Text Inputs
    else if(leng[i].id){
      var item = leng[i].id;
      if (sessionStorage.getItem(item)){
        if(sessionStorage.getItem(item).includes("[")){
          var returnstr = JSON.parse(sessionStorage.getItem(item))
          leng[i].value = returnstr;
        }
        else{
          leng[i].value = sessionStorage.getItem(item);
        }
      }
      else{
        leng[i].value = "";
      }
    }
    }
  if(sessionStorage.getItem("qualifications") && document.getElementById("qualifications")){
    var qual = sessionStorage.getItem("qualifications");
    qual = qual.substring(1,qual.length-1)
    qual = qual.split(",");
    for(var i = 1; i < qual.length; i ++){
      addmore();
    }
    var group = document.getElementById("qualifications")
    var inp = group.getElementsByTagName("input")
    for(var i = 0; i< inp.length; i+=2){
      j = Number(i/2)
      var templist = qual[j].split(":")
      inp[i].value = templist[0].substring(1,templist[0].length -1)
      inp[i+1].value = templist[1].substring(1,templist[1].length -1)
    }
  
  }

  checkIfUser(user)
}
  



function checkdatabtns(obj){
  if(sessionStorage.getItem("userType")){
    var user = sessionStorage.getItem("userType");
    document.getElementById(user).click();
  };

}

// ------------------------------------------------------RESET PAGE FORM VALUES IN TEMPORARY SESSION STORAGE-----------------------------------------
function reset2(){
  var form = document.getElementById("contactForm");
  var leng = form.getElementsByTagName("input");
  for(var i = 0; i< leng.length; i++){
    var item = leng[i].id;
    sessionStorage.removeItem(item);
  }
}

//-----------------------------------------------------------------------ONLOAD FOR LOGIN PAGE TO CHECK WHETHER USER IS LOGGED IN---------------------------------
function checklogin(obj){
  if (sessionStorage.getItem("loggedin") == "true") {
    document.getElementById("test").innerHTML = "Welcome " + sessionStorage.getItem("name");
    document.getElementById("test1").innerHTML = "Finding tutees and tutors have never been easier!";
    document.getElementById("test2").remove();
  }
  else{
    document.getElementById("test").innerHTML = "Existing User Log In:";
    document.getElementById("test1").innerHTML = "Log in with your Google Account to access various features such as finding tutees/tutors!";
  }

}

// ------------------------------------------------------------------TO LOG OUT--------------------------------------------
function logout(){
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  if(sessionStorage.getItem("loggedin") == "true"){
    firebase.auth().signOut()
    sessionStorage.setItem("loggedin","false");
    alert("you will be logged out");
    document.getElementById("logout").href = "about.html";
  }
}



// ------------------------------------------------------------------TO SHOW PROMPT FOR GOOGLE CALENDER LINK--------------------------------------------
function showprompt(){
  var ele = document.getElementById("prompt");
  if(ele.style.visibility == "hidden"){
    ele.style.visibility = "visible";
  }
  else{
    ele.style.visibility = "hidden";
  }
}







