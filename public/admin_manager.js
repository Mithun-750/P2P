$(function () {
    if (document.cookie.includes('username')) {
        console.log("Logged in user");
        $('#header').load('header.html');
    } else {
        console.log("No logged in user");
        $('#header').load('header1.html');
    }
    $('#footer').load('footer.html');
});


function opencloseform(button) {
    var index = Array.from(document.getElementsByClassName("buttons")).indexOf(button);
    var forms = document.getElementsByClassName("forms");
    var notifications=document.querySelectorAll(".notification");
    for (var i = 0; i < forms.length; i++) {
        notifications[i].innerHTML=""
        if (i === index && (forms[i].style.display === "none"|| forms[i].style.display === "")) {
        forms[i].style.display = "block";
        } else {
            forms[i].style.display = "none";
        }
    }
}
function closeallforms()
{ var forms = document.getElementsByClassName("forms");
var notifications=document.querySelectorAll(".notification");
for (var i = 0; i < forms.length; i++) {
    notifications[i].innerHTML=""
   forms[i].style.display = "none";
    }
}
function opencloselogin()
{
    const x=document.getElementById("displayLogin");
    if(x.style.display!="none"&&x.style.display!="")
    {
        x.style.display="none";
    }
    else{
        getLoginDet();
        closeallforms();
    }
}

function openclosereg()
{
    const x=document.getElementById("displayReg");
    if(x.style.display!="none"&&x.style.display!="")
    {
        x.style.display="none";
    }
    else{
        getRegDet();
        closeallforms();
    }
}


        function getLoginDet() {
            fetch('/admin/getLoginDet')
                .then(response => response.text())
                .then(data => {
                    const userListData = JSON.parse(data);

                    const userList = document.getElementById('displayLogin');
                    userList.innerHTML = '';
                    userListData.forEach(user => {
                        const listItem = document.createElement('li');
                        listItem.textContent = user;
                        userList.appendChild(listItem);
                    })
                    userList.style.display="block";
                })
                .catch(error => {
                    console.log(error)
                    document.getElementById("loginnotification").style.color="red";
                    document.getElementById("loginnotification").textContent = "Failed to fetch login users";
                    document.getElementById("loginnotification").style.display = "block";
                });
        }


    function getRegDet() {
     
    fetch('/admin/getRegDet')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch registered users');
            }
            return response.json();
        })
        .then(data => {
            const userList = document.getElementById('displayReg');
            userList.innerHTML = '';
            data.forEach(user => {
                const listItem = document.createElement('li');
                listItem.textContent = user.username;
                userList.appendChild(listItem);
            });
            userList.style.display="block";
        })
        .catch(error => {
            console.error(error);
            document.getElementById("registernotification").style.color="red";
            document.getElementById("registernotification").textContent = "Failed to fetch registered users";
            document.getElementById("registernotification").style.display = "block";
        });
}

    document.querySelector("#updateroleform").addEventListener("submit", async (event) => {
    await event.preventDefault();
    document.querySelector("#updaterolenotification").style.color="red";
    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    document.querySelector("#updaterolenotification").style.display = "none";
    try {
        const response = await fetch("/admin/updaterole", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.log(errorResponse.message);

            document.querySelector("#updaterolenotification").textContent = errorResponse.message;
            document.querySelector("#updaterolenotification").style.display = "block";
        } else {
            console.log("Role updated  Successfully !");
            document.querySelector("#updaterolenotification").textContent = "Role updated successfully";
            document.querySelector("#updaterolenotification").style.color="green";
            document.querySelector("#updaterolenotification").style.display = "block";
        }
    } catch (error) {
        console.error("Network error:", error);
        const err_msg = "Network error. Please try again.";
        document.querySelector("#updaterolenotification").textContent = err_msg;
        document.querySelector("#updaterolenotification").style.display = "block";
    }
    form.reset();
});

    document.querySelector("#updateform").addEventListener("submit", async (event) => {
    await event.preventDefault();
    document.querySelector("#updatenotification").style.color="red";
    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    document.querySelector("#updatenotification").style.display = "none";
    try {
        const response = await fetch("/admin/updatepassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.log(errorResponse.message);

            document.querySelector("#updatenotification").textContent = errorResponse.message;
            document.querySelector("#updatenotification").style.display = "block";
        } else {
            console.log("password updated  Successfully !");
            document.querySelector("#updatenotification").style.color="green";
            document.querySelector("#updatenotification").textContent = "Password updated successfully";
            document.querySelector("#updatenotification").style.display = "block";
        }
    } catch (error) {
        console.error("Network error:", error);
        const err_msg = "Network error. Please try again.";
        document.querySelector("#updatenotification").textContent = err_msg;
        document.querySelector("#updatenotification").style.display = "block";
    }
    form.reset();
});

    document.querySelector("#deleteForm").addEventListener("submit", async (event) => {
    await event.preventDefault();
    document.querySelector("#deletenotification").style.color="red";
    document.querySelector("#deletenotification").style.display="none"
    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
   
    try {
        const response = await fetch('/admin/delAcc', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });
        if (!response.ok) {
            const errorResponse = await response.json();
            console.log(errorResponse.message);
            document.querySelector("#deletenotification").textContent = errorResponse.message;
            document.querySelector("#deletenotification").style.display = "block";
        } else {
            console.log("Account deleted Successfully !");
            document.querySelector("#deletenotification").style.color="green";
            document.querySelector("#deletenotification").textContent = "Account deleted successfully !";
            document.querySelector("#deletenotification").style.display = "block";
        }
    } catch (error) {
        console.log(error)
        document.querySelector("#deletenotification").textContent = "Network error. Please try again.";
        document.querySelector("#deletenotification").style.display = "block";
    }
    form.reset();
});



document.addEventListener('DOMContentLoaded', function () {
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        item.querySelector('.accordion-title').addEventListener('click', function () {
            item.classList.toggle('active');
            const answer = item.querySelector('.answer');
            if (item.classList.contains('active')) {
                const words = answer.textContent.trim().split(/\s+/); // Trim and split by whitespace
                answer.innerHTML = ''; // Clear the content
                words.forEach((word, index) => {
                    const span = document.createElement('span');
                    span.textContent = word;
                    span.classList.add('animate-word');
                    answer.appendChild(span);
                    if (index < words.length - 1) {
                        const space = document.createTextNode(' ');
                        answer.appendChild(space); // Add space between words
                    }
                    span.style.animationDelay = `${index * 0.05}s`; // Adjusted animation delay
                });
            }
        });
    });
});