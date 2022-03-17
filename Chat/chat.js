// Original code made by WADII G9T10 2021 project MTOR Juan Sebasitan jsebastian.2020

// //Production database
const firebaseConfig = {
    apiKey: "AIzaSyBee5mbaSxk1JnnIHlkZxx4bwdtP0HY5g0",
    authDomain: "wad-mtor.firebaseapp.com",
    databaseURL:
        "https://wad-mtor-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wad-mtor",
    storageBucket: "wad-mtor.appspot.com",
    messagingSenderId: "908590207014",
    appId: "1:908590207014:web:f1b1ab657d1a2bffe296e7",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const chat = Vue.createApp({
    data() {
        return {
            userId: sessionStorage.getItem("userID"),
            // userId: "CGiLcmyL7FawAYdtCw7HXegtTZQ2",
            toId: sessionStorage.getItem("toId"),
            // toId: "CGiLcmyL7FawAYdtCw7HXegtTZQ3",
            chatId: "",
            userNameList: {},
            unReadList: {},
            toSend: "",
            history: {},
            userList: [],
            imgList: {},
            statusList: {},
            searchId: "",
            rerender: 0,
            isActive: false,
        };
    },

    created() {
        const userChatList = firebase.database().ref("chats/");

        if (this.toId !== "") {
            this.showChat(this.toId);
        }
        var userChatListLength = 0;
        // this.setStatus(this.userId, true);
        userChatList.on("value", (snapshot) => {
            if (Object.keys(snapshot.val()).length !== userChatListLength) {
                userChatListLength = Object.keys(snapshot.val()).length;
                for (const chatId in snapshot.val()) {
                    if (chatId.includes(this.userId)) {
                        const userArr = chatId.split(",");
                        this.remove(userArr, this.userId);
                        const userId = userArr[0];
                        if (!this.userList.includes(userId)) {
                            this.userList.push(userId);
                            this.getImg(userId);
                            this.getStatus(userId);
                            this.getUnRead(chatId, userId);
                            this.getName(userId);
                        }
                    }
                }
            }
        });
    },

    methods: {
        downloadFile(timestamp, filename) {
            const chatFiles = firebase
                .storage()
                .ref()
                .child("chats/" + this.chatId);

            chatFiles
                .child(timestamp)
                .child(filename)
                .getDownloadURL()
                .then((url) => {
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        sendFiles(event) {
            const files = event.target.files;
            
            const timestamp = new Date().toISOString();
            const chatLog = firebase
                .database()
                .ref("chats/" + this.chatId + "/chatLog");

            const chatFile = firebase
                .storage()
                .ref()
                .child("chats/" + this.chatId + "/" + timestamp);

            const chatUnread = firebase
                .database()
                .ref("chats/" + this.chatId + "/unRead/" + this.userId);

            chatUnread.set(firebase.database.ServerValue.increment(1));

            for (const file of files) {
                chatFile
                    .child(file.name)
                    .put(file)
                    .then((snapshot) => {
                        console.log("Uploaded a blob or file!");
                        chatLog.push({
                            type: "image",
                            from: this.userId,
                            message: file.name,
                            timestamp: timestamp,
                        })
                        .then(() => {
                            event.target.value = ''
                            console.log('success')
                        })
                        .catch((error) => {
                            event.target.value = ''
                            console.log(error);
                        });

                        
                    })
                    .catch((error) => {
                        event.target.value = ''
                        console.log("Failed to upload a blob or file!");
                    });
            }
        },
        getUnRead(chatId, userId) {
            const chatUnread = firebase
                .database()
                .ref("chats/" + chatId + "/unRead/" + userId);
            chatUnread.on("value", (unReadVal) => {
                this.unReadList[userId] = unReadVal.val();
            });
        },
        logout() {
            this.setStatus(this.userId, false);
            window.location.replace("index.html");
        },

        handler() {
            return "Do you really want to close?";
        },

        show(userId) {
            if (!this.userNameList[userId].toLocaleLowerCase().includes(this.searchId.toLocaleLowerCase())) {
                return false;
            } else {
                return true;
            }
        },
        getImg(userId) {
            const profile = firebase.storage().ref().child("profile");

            profile
                .child(userId + ".jpg")
                .getDownloadURL()
                .then((url) => {
                    this.imgList[userId] = url;
                })
                .catch((error) => {
                    this.imgList[userId] = "assets/default.jpg";
                });
        },
        getStatus(userId) {
            const users = firebase.database().ref("users/");
            users
                .child(userId)
                .child("online")
                .on("value", (snapshot) => {
                    this.statusList[userId] = snapshot.val();
                });
        },
        setStatus(userId, status) {
            const users = firebase.database().ref("users/");
            users.child(userId).update({ online: status });
        },
        getName(userId) {
            const name = firebase.database().ref("users/" + userId + "/name");
            name.on("value", (snapshot) => {
                this.userNameList[userId] = snapshot.val();
            });
        },
        showChat(toId) {
            this.isActive = false;
            this.toId = toId;
            if (!(toId in this.imgList)) {
                this.getImg(toId);
            }

            this.chatId = [this.userId, this.toId].sort().join();
            const chatUnread = firebase
                .database()
                .ref("chats/" + this.chatId + "/unRead/" + this.toId);

            const chatLog = firebase
                .database()
                .ref("chats/" + this.chatId + "/chatLog");

            let animate = false;
            chatLog.on("value", (snapshot) => {
                if (toId != this.toId) {
                    chatLog.off("value");
                } else {
                    chatUnread.once("value", (unReadVal) => {
                        if (unReadVal.exists()) {
                            chatUnread.set(0);
                        }
                    });
                    this.history = snapshot.val();
                    Vue.nextTick(() => {
                        this.scrollToBottom(animate);
                        animate = true;
                    });
                }
            });
        },
        send(event) {
            if (event.shiftKey || !/\S/.test(this.toSend)) {
                //regex for the win. ewww
                return;
            }

            const chatLog = firebase
                .database()
                .ref("chats/" + this.chatId + "/chatLog");

            const chatUnread = firebase
                .database()
                .ref("chats/" + this.chatId + "/unRead/" + this.userId);

            chatUnread.set(firebase.database.ServerValue.increment(1));

            chatLog.push({
                type: "text",
                from: this.userId,
                message: this.toSend,
                timestamp: new Date().toISOString(),
            });
            this.toSend = "";
        },
        remove(array, el) {
            const index = array.indexOf(el);
            if (index > -1) {
                array.splice(index, 1);
            }
        },

        computeTimestamp(timestamp) {
            const date = new Date(timestamp);
            const today = new Date();
            if (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
            ) {
                return date.toLocaleTimeString().slice(0, 5) + ", Today";
            } else {
                return (
                    date.toLocaleTimeString().slice(0, 5) +
                    ", " +
                    date.toLocaleDateString().slice(0, 5)
                );
            }
        },

        scrollToBottom(animate) {
            var scroll = $("#chat-history");
            if (animate) {
                scroll.animate({ scrollTop: scroll.prop("scrollHeight") });
            } else {
                scroll.scrollTop(scroll.prop("scrollHeight"));
            }
        },
        toggleSidebar() {
            this.isActive = !this.isActive;
        },
    },
});
chat.mount("#chat");

// $(document).ready(function () {
//     $('#sidebarCollapse').on('click', function () {
//         $('#sidebar').toggleClass('active');
//     });

// });
