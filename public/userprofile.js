


window.addEventListener("load", () => {
  const boxlist = document.querySelectorAll('.box');
  boxlist.forEach((box, index) => {
    box.classList.remove('flippedreverse');
    if (index == 0) {
      box.style.display = "block";
    } else {
      box.style.display = "none";
    }
  });
});
   
function showbox(x) {
      const boxlist = document.querySelectorAll('.box');
      if(boxlist[x].style.display =='none'){
      boxlist.forEach((box, index) => {    
        if (index == x) {
          box.style.display = "block";
          box.classList.remove('flippedreverse');
          box.classList.add('flipped');
        } else {  
          box.classList.remove('flipped');
          box.classList.add('flippedreverse');
          setTimeout(() => {
            box.style.display = "none";
          },1000);
          }
      });
    }
}

document.getElementById('update-photo').addEventListener('click', function() {
  document.getElementById('photo').click();
});

document.getElementById('photo').addEventListener('change', function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function() {
      document.getElementById('profile-photo').src = reader.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('delete-photo').addEventListener('click', function() {
  document.getElementById('profile-photo').src = 'default-profile-photo.jpg';
  document.getElementById('photo').value = ''; // Clear the file input
});



document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch("/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const err_msg = await response.json();
      console.log(err_msg.errorMessage);
    } else {
      const user_data = await response.json();
      document.querySelector(".username").textContent = user_data.username;
      document.querySelector(".email").textContent = user_data.email;
    }
  } catch (error) {
    console.error("Network error:", error);
  }
});

document.querySelector(".card form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/updateuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });

    if (!response.ok) {
      const err_msg = await response.json();
      console.log(err_msg.errorMessage);

      document.querySelector(".errorMessage").textContent = err_msg.errorMessage;
      document.querySelector(".errorMessage").style.display = "block";
    } else {
      console.log("Update successful");
      window.location.href = "/user"; 
    }
  } catch (error) {
    console.error("Network error:", error);
    const err_msg = "Network error. Please try again.";
    document.querySelector(".errorMessage").textContent = err_msg;
    document.querySelector(".errorMessage").style.display = "block";
  }
});


document.querySelectorAll(".detail_value input").forEach((ip) => {
  ip.addEventListener("input", () => {
    document.querySelectorAll(".errorMessage").forEach((ep) => {
      ep.textContent = "";
      ep.style.display = "none";
    });
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const err_msg = await response.json();
      console.error(err_msg.errorMessage);
    } else {
      const user_data = await response.json();
      document.querySelector(".fullname").textContent = user_data.username;
      const ageDate = new Date(user_data.dateofbirth);

      if (ageDate instanceof Date && !isNaN(ageDate)) {
        document.querySelector(".dob").textContent = ageDate.toLocaleDateString();
        document.querySelector(".age").textContent = calculateAge(ageDate);
      } else {
        console.error("Invalid date format for age:", user_data.dateofbirth);
      }
    }
  } catch (error) {
    console.error("Network error:", error);
  }
});

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}


document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const err_msg = await response.json();
      console.error(err_msg.errorMessage);
    } else {
      const user_data = await response.json();
      document.querySelector(".fullname").textContent = user_data.username;
      document.querySelector(".dob").textContent = user_data.age.toLocaleDateString(); // Convert Date to String
      document.querySelector(".age").textContent = calculateAge(user_data.age);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
});

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}



document.addEventListener('DOMContentLoaded', async () =>{
  try {
    const response = await fetch("/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const err_msg = await response.json();
      console.log(err_msg.errorMessage);
    } else {
      const user_data = await response.json();
      // console.log(user_data.download);
      if (user_data.download.length !== 0) {
        document.querySelector(".card_load_extreme_descripion1").style.display = "none";
        for (let i = 0; i < user_data.download.length; i++) {
          const download = user_data.download[i];
          const h1 = document.createElement('h1');
          h1.textContent = download;
          h1.classList.add(".visible");
          document.querySelector("#downloads").appendChild(h1); 
        }
      }

      if (user_data.purchase.length !== 0) {
        document.querySelector(".card_load_extreme_descripion2").style.display = "none";
        for (let i = 0; i < user_data.purchase.length; i++) {
          const purchase = user_data.purchase[i];
          const h1 = document.createElement('h1');
          h1.textContent = purchase;
          h1.classList.add(".visible");
          document.querySelector("#transactions").appendChild(h1); 
        }
      }
    }
  } catch (error) {
    console.error("Network error:", error);
  }
})