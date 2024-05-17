document.querySelector(".password-box form").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
  
    try {
        const response = await fetch("/user/password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });
  
        if (!response.ok) {
            const err_msg = await response.json();
            console.log(err_msg.errorMessage);
  
            form.querySelector(".errorMessage").textContent = err_msg.errorMessage;
            form.querySelector(".errorMessage").style.display = "block";
        } else {
            console.log("successful");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Network error:", error);
        const err_msg = "Network error. Please try again.";
        form.querySelector(".errorMessage").textContent = err_msg;
        form.querySelector(".errorMessage").style.display = "block";
    }
});

document.querySelectorAll(".input-box input").forEach(input => {
    input.addEventListener("input", () => {
        const form = input.closest("form");
        form.querySelector(".errorMessage").textContent = "";
        form.querySelector(".errorMessage").style.display = "none";
    });
});
