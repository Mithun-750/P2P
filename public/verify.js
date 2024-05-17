document.querySelector(".register").addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const formObject = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.log(errorResponse.errorMessage);

      document.querySelector(".errorregister").textContent = errorResponse.errorMessage;
      document.querySelector(".errorregister").style.display = "block";
    } else {
      console.log("Successful registration");
      window.location.href = "/register2";
    }
  } catch (error) {
    console.error("Network error:", error);
    const err_msg = "Network error. Please try again.";
    document.querySelector(".errorregister").textContent = err_msg;
    document.querySelector(".errorregister").style.display = "block";
  }
});


const inputs = document.querySelectorAll(".inputBx input");


inputs.forEach(input => {
  input.addEventListener("input", () => {
   
    document.querySelector(".errorregister").textContent = "";
    document.querySelector(".errorregister").style.display = "none";
  });
});
