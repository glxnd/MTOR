

function goProfile() {
  userType = sessionStorage.getItem("userType");
  sessionStorage.setItem("profileID", sessionStorage.getItem("userID"));
  if (userType == "Tutor") {
    window.location.href = "../Profile/teacher_profile.html";
  } else {
    window.location.href = "../Profile/student_profile.html";
  }
}

function goSchedule() {
  userDB = firebase.database().ref("users");
  userDB
    .child(userID)
    .get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        schedule = snapshot.val().calendar;
        console.log(schedule);
        window.location.href = schedule;
      }
    });
}

function logout() {
  if (sessionStorage.getItem("loggedin") == "true") {
    try {
      const users = firebase.database().ref("users/");
      const userId = sessionStorage.getItem("userID");
      const user = firebase.database().ref("users/" + userId);
      user.once("value").then((snapshot) => {
          if (snapshot.exists()) {
            users.child(userId).update({ online: false });
  
          }
          
          sessionStorage.clear();
          window.location.href = "../Homepage/homepage_no_login.html";
        })
      
    } catch (error) {
      sessionStorage.clear();
          window.location.href = "../Homepage/homepage_no_login.html";
    }
  }
}

if (document.getElementById("myModal") != null) {
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btns = document.getElementsByClassName("example");

  // Get the <span> element that closes the modal
  var spanyes = document.getElementById("closebutton");

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      modal.style.display = "block";
    });
  }
  // When the user clicks on the button, open the modal

  function closemodal() {
    modal.style.display = "none";
  }

  // When the user clicks on <span> (x), close the modal
  spanyes.onclick = function () {
    modal.style.display = "none";
    location.reload();
  };

  // When the user clicks anywhere outside of the modal, close it
}

const app = Vue.createApp({
  data() {
    return {
      contactusName: "",
      contactusEmail: "",
      contactusPhone: "",
      contactusMsg: "",
      Emailalert: "",
      Phonealert: "",
      submitAlert: "",
      success: "",
    };
  },
  methods: {
    submitContactUs() {
      if (
        this.contactusName == "" ||
        this.contactusEmail == "" ||
        this.contactusMsg == "" ||
        this.contactusPhone == ""
      ) {
        this.Emailalert = "Email cannot be empty!";
        this.Phonealert = "Phone cannot be empty!";
        this.submitAlert = "Please filll in all equired fields";
      } else {
        if ((this.Phonealert == "") & (this.Emailalert == "")) {
          this.submitAlert =
            "Contact Us details submission done, we will be contacting you back shortly!";
          firebase
            .database()
            .ref("contactus/" + this.contactusName)
            .set(
              {
                email: this.contactusEmail,
                phone: this.contactusPhone,
                msg: this.contactusMsg,
              },
              function (error) {
                if (error) {
                  this.success =
                    "Contact Us Form submission failed. ";
                } else {
                  this.success =
                    "Contact Us submission done!";
                }
              }
            );
        } else {
          this.submitAlert =
            "Please ensure all fields are correctly filled.";
        }
      }
    },
    checkEmail() {
      if (this.contactusEmail.indexOf("@") == -1) {
        this.Emailalert = "Your email address has to include '@'";
      } else {
        this.Emailalert = "";
      }
    },
    checkPhone() {
      if (isNaN(this.contactusPhone)) {
        this.Phonealert = "Phone number only can contain numbers.";
      } else {
        this.Phonealert = "";
      }
    },

    resetForm() {
      this.contactusPhone = "";
      this.contactusName = "";
      this.contactusEmail = "";
      this.contactusMsg = "";
      this.Emailalert = "";
      this.Phonealert = "";
      this.submitAlert = "";
      this.success = "";
      this.autoInput();
    },

    autoInput() {
      userID = sessionStorage.getItem("userID");
      if (userID != null) {
        this.contactusEmail = sessionStorage.getItem("email");
        this.contactusPhone = sessionStorage.getItem("phone");
        this.contactusName = sessionStorage.getItem("name");
      }
    },
  },

  created() {
    this.autoInput();
  },
}).mount("#contactUs");



function getChatNotif() {
  const userChatList = firebase.database().ref("chats/");

  const thisUserID = sessionStorage.getItem("userID");

  function remove(array, el) {
      const index = array.indexOf(el);
      if (index > -1) {
          array.splice(index, 1);
      }
  }
  function getUnRead(chatId, userId) {
      const chatUnread = firebase
          .database()
          .ref("chats/" + chatId + "/unRead/" + userId);
      chatUnread.on("value", (unReadVal) => {
          return unReadVal.val();
      });
  }
  var unRead;
  userChatList.on("value", (snapshot) => {
      unRead = 0;
      for (const chatId in snapshot.val()) {
          if (chatId.includes(thisUserID)) {
              const userArr = chatId.split(",");
              remove(userArr, thisUserID);
              const userId = userArr[0];
              const chatUnread = firebase
                  .database()
                  .ref("chats/" + chatId + "/unRead/" + userId);
              chatUnread.on("value", (unReadVal) => {
                  if (unReadVal.val() !== 0 && !isNaN(unReadVal.val()) && unReadVal.val()!==null) {
               
                    document.getElementById("chatNotif").style.display = "inline-block";
                    document.getElementById("chatNotif2").style.display = "inline-block";
                }
              });
              
          }
      }
      
  });
}
