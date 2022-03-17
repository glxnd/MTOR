/*!
 * Start Bootstrap - Modern Business v5.0.4 (https://startbootstrap.com/template-overviews/modern-business)
 * Copyright 2013-2021 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-modern-business/blob/master/LICENSE)
 */
// This file is intentionally blank
// Use this file to add JavaScript to your project
window.sessionStorage;
// -----------------------------------------CHECK FIREBASE DATABASE INFORMATION AND PREFILL INTO PROFILE INPUT VALUES------------------------------

function checkdatabaseinfo(uid) {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    // var uid = sessionStorage.getItem("userID");
    var user = firebase.database().ref("users/" + uid);
    user.once("value").then((snapshot) => {
        if (snapshot.exists()) {
            for (var i in snapshot.val()) {
                var x = snapshot.val()[i];
                if (typeof x === "object") {
                    var y = JSON.stringify(x);
                    sessionStorage.setItem(i, y);
                } else {
                    sessionStorage.setItem(i, snapshot.val()[i]);
                }
            }
            // document.getElementById("status").innerText = "User ID has already been taken.";
            const users = firebase.database().ref("users/");

            users.child(uid).update({ online: true });
            window.location.href = "homepage.html";
        } else {
            // document.getElementById("status").innerText = "User ID is available.";
            console.log("can leave empty");
            window.location.href = "../Login/SignUp1.html";
        }
    });
}

// --------------------------------------------------------------------Google Login -------------------------------------------------------
function googlelogin() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: "select_account",
    });
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            var token = credential.accessToken;
            var user = result.user;
            sessionStorage.setItem("loggedin", "true");
            checkdatabaseinfo(user.uid);
            sessionStorage.setItem("name", user.displayName);
            sessionStorage.setItem("email", user.email);
            sessionStorage.setItem("userID", user.uid);
            var currentid = sessionStorage.getItem("userID");
            var user2 = firebase.database().ref("users/" + currentid);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
            alert(errorMessage);
        });
}

// --------------------------------------------------------------------Get list of tutors to display in carousell -------------------------------------------------------

function FinalGetTutors() {
    var ids = [
        "#card1",
        "#card2",
        "#card3",
        "#card4",
        "#card5",
        "#card6",
        "#card7",
        "#card8",
        "#card9",
    ];
    var counter = 0;
    var tutors = [];
    var users = firebase
        .database()
        .ref("users")
        .once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childKey = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.userType == "Tutor") {
                    var tutorname = childData.name;
                    var profile = childData.description;
                    var tutorage = childData.age;
                    var tutorgender = childData.gender;
                    var tutorteachingLevel = childData.teachingLevel;
                    var tutorrate = childData.rate;
                    var tutorsubjects = childData.subjects;
                    var id = ids[counter];
                    counter = counter + 1;
                    const profile1 = firebase.storage().ref().child("profile");
                    profile1
                        .child(childKey + ".jpg")
                        .getDownloadURL()
                        .then((url) => {
                            const vm = Vue.createApp({
                                data() {
                                    return {
                                        name: tutorname,
                                        desc: profile,
                                        age: tutorage,
                                        gender: tutorgender,
                                        teachingLevel: tutorteachingLevel,
                                        rate: tutorrate,
                                        subjects: tutorsubjects.join(", "),
                                        location: "",
                                        profilepic: url,
                                    };
                                },
                            }).mount(id);
                        })
                        .catch((error) => {
                            url =
                                "https://firebasestorage.googleapis.com/v0/b/wad-mtor.appspot.com/o/profile%2Fdefault.png?alt=media&token=baee6522-1577-455c-848a-7c07609b3063";
                            const vm = Vue.createApp({
                                data() {
                                    return {
                                        name: tutorname,
                                        desc: profile,
                                        age: tutorage,
                                        gender: tutorgender,
                                        teachingLevel: tutorteachingLevel,
                                        rate: tutorrate,
                                        subjects: tutorsubjects.join(", "),
                                        location: "",
                                        profilepic: url,
                                    };
                                },
                            }).mount(id);
                        });
                }
            });
        });
}

// -------------------------------------------------------------------- Vue program to do contact us -------------------------------------------------------

// --------------------------------------------------------------------VUE TO SUBMIT REQUEST  -------------------------------------------------------

if (document.getElementById("reqModal") != null) {
    const app3 = Vue.createApp({
        data() {
            return {
                availableLevels: ["Primary", "Secondary", "Tertiary"],
                reqTeachingLevel: "Primary",
                reqSubject: "",
                reqRequirements: "",
                reqSubjectAlert: "",
                userID: "",
                help: "",
                reqSubmitAlert: "",
            };
        },
        methods: {
            submitRequest() {
                if (this.reqSubject == "") {
                    this.reqSubjectAlert = "Subject cannot be empty!";
                    this.reqSubmitAlert =
                        "Please ensure all fields are correctly filled.";
                } else {
                    var today = new Date();
                    today = today.toLocaleString();
                    this.reqSubmitAlert = "Successfully Submitted";
                    index = 0;
                    const reqDB = firebase.database().ref("requests/");
                    var newChildRef = reqDB.push();
                    newChildRef.set({
                        requserID: this.userID,
                        requirements: this.reqRequirements,
                        reqsubject: this.reqSubject,
                        reqTeachingLevel: this.reqTeachingLevel,
                        applied: "No one has applied yet.",
                        location: sessionStorage.getItem("postal"),
                        posted: today,
                    });

                    var requests = firebase
                        .database()
                        .ref("requests")
                        .once("value", function (snapshot) {
                            snapshot.forEach(function (childSnapshot) {
                                var childKey = childSnapshot.key;
                                var childData = childSnapshot.val();
                            });
                        });
                    this.resetForm();
                }
            },
            resetForm() {
                this.reqTeachingLevel = "Primary";
                this.reqSubject = "";
                this.reqRequirements = "";
                this.reqSubjectAlert = "";
            },
            resetForm2() {
                this.reqTeachingLevel = "Primary";
                this.reqSubject = "";
                this.reqRequirements = "";
                this.reqSubmitAlert = "";
                this.reqSubjectAlert = "";
            },
        },

        created() {
            this.userID = sessionStorage.getItem("userID");
        },
    }).mount("#reqModal");
}

//-------------- get request posted by user -----------------//
if (document.getElementById("myRequests") != null) {
    const app4 = Vue.createApp({
        data() {
            return {
                listofrequests: [],
            };
        },
        methods: {
            displayDetails(reqUser, reqID) {
                var name = "try";
                if (reqUser != "No one has applied yet.") {
                    users = firebase.database().ref("users/" + reqUser);
                    users.get().then((snapshot) => {
                        if (snapshot.exists()) {
                            document.getElementById(reqUser + reqID).innerHTML =
                                snapshot.val().name;
                            document.getElementById(
                                reqID + reqUser
                            ).style.display = "block";
                        }
                    });
                } else {
                    return "No one has applied yet.";
                }
            },
            deleteReq(reqID) {
                reqDB = firebase
                    .database()
                    .ref("requests/" + reqID)
                    .remove();
                alert("Successfully removed!");
                location.reload();
            },
            removeApplicator(reqID, requserID) {
                applied = false;
                appliedUsers = [];
                reqDB = firebase
                    .database()
                    .ref("requests/" + reqID + "/applied");
                reqDB.get().then((snapshot) => {
                    if (snapshot.exists()) {
                        console.log("hi");
                        appliedUsers = snapshot.val().split(",");
                        const index = appliedUsers.indexOf(requserID);
                        appliedUsers.splice(index, 1);
                        if (appliedUsers.length == 0) {
                            var updates = {};
                            updates["/requests/" + reqID + "/applied"] =
                                "No one has applied yet.";
                            firebase.database().ref().update(updates);
                        } else {
                            var updates = {};
                            updates["/requests/" + reqID + "/applied"] =
                                appliedUsers.join(",");
                            firebase.database().ref().update(updates);
                        }
                    }
                });
                alert("Applicator successfully removed!");
                location.reload();
            },
            viewProfile(requestedID) {
                console.log(requestedID);
                sessionStorage.setItem("profileID", requestedID);
                window.location.href = "../Profile/teacher_profile.html";
            },
        },
        created() {
            const self = this;
            currentUser = sessionStorage.getItem("userID");
            self.listofrequests = [];
            firebase
                .database()
                .ref("requests")
                .once("value", function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var posted = childSnapshot.val().posted;
                        var applied = childSnapshot.val().applied.split(",");
                        var reqTeachingLevel =
                            childSnapshot.val().reqTeachingLevel;
                        var reqSubject = childSnapshot.val().reqsubject;
                        var reqRequirements = childSnapshot.val().requirements;
                        var requserID = childSnapshot.val().requserID;
                        var reqLocation = sessionStorage.getItem("postal");
                        var reqID = childSnapshot.key;
                        if (requserID == currentUser) {
                            self.listofrequests.push({
                                location: reqLocation,
                                reqID: reqID,
                                applied: applied,
                                requirement: reqRequirements,
                                teachingLevel: reqTeachingLevel,
                                subject: reqSubject,
                                date: posted,
                            });
                        }
                    });
                });
        },
    }).mount("#myRequests");
}

//-------------- get requests for tutor's teachingLevel  -----------------//
if (document.getElementById("allRequests") != null) {
    const app5 = Vue.createApp({
        data() {
            return {
                listofrequests: [],
                currentUser: sessionStorage.getItem("userID"),
                distanceDummy: "distanceDummy",
                streetDummy: "streetDummy",
                cancelRequestDummy: "cancelDummy",
            };
        },

        methods: {
            hide() {
                console.log(this.listofrequests);
                if (this.listofrequests.length == 0) {
                    document.getElementById("norequest").style.display =
                        "block";
                } else {
                    document.getElementById("norequest").style.display = "none";
                }
            },
            getLocation(requesterLocation, requestID) {
                myLocation = sessionStorage.getItem("postal");
                console.log(requesterLocation);
                getCoor(
                    requesterLocation,
                    myLocation,
                    this.currentUser,
                    requestID
                );
            },

            checkifAppliedAuto(reqID) {
                applied = false;
                appliedUsers = [];
                reqDB = firebase
                    .database()
                    .ref("requests/" + reqID + "/applied");
                reqDB.get().then((snapshot) => {
                    if (snapshot.exists()) {
                        appliedUsers = snapshot.val().split(",");
                        console.log(appliedUsers);
                        if (appliedUsers.includes(currentUser)) {
                            document.getElementById(reqID).style.display =
                                "none";
                            document.getElementById(
                                reqID + this.cancelRequestDummy
                            ).style.display = "block";
                        }
                    }
                });
            },

            cancelReq(reqID) {
                appliedUsers = [];
                reqDB = firebase
                    .database()
                    .ref("requests/" + reqID + "/applied");
                reqDB.get().then((snapshot) => {
                    if (snapshot.exists()) {
                        appliedUsers = snapshot.val().split(",");
                        const index = appliedUsers.indexOf(this.currentUser);
                        appliedUsers.splice(index, 1);
                        if (appliedUsers.length == 0) {
                            var updates = {};
                            updates["/requests/" + reqID + "/applied"] =
                                "No one has applied yet.";
                            firebase.database().ref().update(updates);
                        } else {
                            var updates = {};
                            updates["/requests/" + reqID + "/applied"] =
                                appliedUsers.join(",");
                            firebase.database().ref().update(updates);
                        }
                    }
                });
                alert("Your application has been successfully removed!");
                location.reload();
            },

            checkifApplied(reqID) {
                applied = false;
                appliedUsers = [];
                reqDB = firebase
                    .database()
                    .ref("requests/" + reqID + "/applied");
                reqDB.get().then((snapshot) => {
                    if (snapshot.exists()) {
                        appliedUsers = snapshot.val().split(",");
                        console.log(appliedUsers);
                        if (appliedUsers.includes(currentUser)) {
                            alert("You have already applied for this request");
                            document.getElementById(reqID).disabled = true;
                            document.getElementById(reqID).innerText =
                                "Applied";
                        } else {
                            this.applyReq(reqID);
                        }
                    }
                });
            },

            applyReq(reqID) {
                reqDB = firebase.database().ref("requests");
                reqDB
                    .child(reqID)
                    .get()
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            if (
                                snapshot.val().applied ==
                                "No one has applied yet."
                            ) {
                                var updates = {};
                                updates["/requests/" + reqID + "/applied"] =
                                    currentUser;
                                firebase.database().ref().update(updates);
                                document.getElementById(reqID).style.display =
                                    "none";
                                document.getElementById(
                                    reqID + this.cancelRequestDummy
                                ).style.display = "block";
                            } else {
                                var currentlyApplied = snapshot.val().applied;
                                var updates = {};
                                updates["/requests/" + reqID + "/applied"] =
                                    currentlyApplied + "," + currentUser;
                                firebase.database().ref().update(updates);
                                document.getElementById(reqID).style.display =
                                    "none";
                                document.getElementById(
                                    reqID + this.cancelRequestDummy
                                ).style.display = "block";
                            }
                        }
                    });
                alert("Successfully applied.");
            },
        },
        created() {
            const self = this;
            currentTeachingLevel = sessionStorage.getItem("teachingLevel");
            console.log(currentTeachingLevel);
            self.listofrequests = [];
            firebase
                .database()
                .ref("requests")
                .once("value", function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var posted = childSnapshot.val().posted;
                        var applied = childSnapshot.val().applied;
                        var reqTeachingLevel =
                            childSnapshot.val().reqTeachingLevel;
                        var reqSubject = childSnapshot.val().reqsubject;
                        var reqRequirements = childSnapshot.val().requirements;
                        var requserID = childSnapshot.val().requserID;
                        var reqID = childSnapshot.key;
                        var reqLocation = childSnapshot.val().location;
                        if (reqTeachingLevel == currentTeachingLevel) {
                            console.log(reqLocation);
                            self.listofrequests.push({
                                location: reqLocation,
                                reqID: reqID,
                                applied: applied,
                                requirement: reqRequirements,
                                teachingLevel: reqTeachingLevel,
                                subject: reqSubject,
                                date: posted,
                            });
                        }
                    });
                });
        },
    }).mount("#allRequests");
}

// --------------------------------------------------------------------JAVASCRIPT FOR CONTACT US MODAL  -------------------------------------------------------

// --------------------------------------------------------------------JAVASCRIPT TO DO REQ MODAL -------------------------------------------------------
if (document.getElementById("reqModal") != null) {
    var reqModal = document.getElementById("reqModal");

    // Get the button that opens the modal
    var reqbtn = document.getElementById("request");

    // Get the <span> element that closes the modal
    var reqyes = document.getElementById("reqclosebutton");

    // When the user clicks on the button, open the modal
    reqbtn.onclick = function () {
        reqModal.style.display = "block";
    };

    function closemodal() {
        reqModal.style.display = "none";
    }

    // When the user clicks on <span> (x), close the modal
    reqyes.onclick = function () {
        reqModal.style.display = "none";
        location.reload();
    };

    // When the user clicks anywhere outside of the modal, close it
}

function writeUserDataWithCompletion(userId, name, email) {
    firebase
        .database()
        .ref("users/" + userId)
        .set(
            {
                username: name,
                email: email,
            },
            function (error) {
                if (error) {
                    document.getElementById("status").innerText =
                        "User Registration Failed!";
                } else {
                    document.getElementById("status").innerText =
                        "User Registration Done!";
                }
            }
        );
}

function getCoor(location1, location2, currentUser, requestedUser) {
    var settings = {
        url: "https://developers.onemap.sg/privateapi/auth/post/getToken",
        data: {
            email: "glendyslau@gmail.com",
            password: "Zinedine77!!",
        },
        async: "true",
    };

    $.post(settings).done(function (response) {
        const myapi = response.access_token;

        const url =
            "https://developers.onemap.sg/commonapi/search?searchVal=" +
            location1 +
            "&returnGeom=Y&getAddrDetails=Y&pageNum=1";

        axios
            .get(url)
            .then((response) => {
                const lat1 = response.data.results[0].LATITUDE;
                const lng1 = response.data.results[0].LONGTITUDE;
             
                document.getElementById(
                    requestedUser + "streetDummy"
                ).innerText = response.data.results[0].ROAD_NAME;
                const url2 =
                    "https://developers.onemap.sg/commonapi/search?searchVal=" +
                    location2 +
                    "&returnGeom=Y&getAddrDetails=N&pageNum=1";
                axios
                    .get(url2)
                    .then((response) => {
                      const lat2 = response.data.results[0].LATITUDE;
                      const lng2 = response.data.results[0].LONGTITUDE;
                        console.log(response.data);
                        const url3 =
                            "https://developers.onemap.sg/privateapi/routingsvc/route?start=" +
                            lat1 +
                            "," +
                            lng1 +
                            "&end=" +
                            lat2 +
                            "," +
                            lng2 +
                            "&routeType=walk&token=" +
                            myapi;
                        return axios
                            .get(url3)
                            .then((response) => {
                              console.log(requestedUser + "distanceDummy", response.data.route_summary.total_distance);
                                document.getElementById(
                                    requestedUser + "distanceDummy"
                                ).innerText =
                                    "approximately " +
                                    response.data.route_summary.total_distance +
                                    "m walking distance away";
                            })
                            .catch((error) => {
                                console.log(error.message);
                            });
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            })
            .catch((error) => {
                console.log(error.message);
            });
    });
}
