
document
  .querySelector(".login-box")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      if (!response.ok) {
        const err_msg = await response.json();
        console.log(err_msg.errorMessage);

        document.querySelectorAll(".errorlogin").forEach((em) => {
          em.textContent = err_msg.errorMessage;
          em.style.display = "block";
        });
      } else {
        console.log("successful");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Network error:", error);
      const err_msg = "Network error. Please try again.";
      document.querySelectorAll(".errorlogin").forEach((em) => {
        em.textContent = err_msg;
        em.style.display = "block";
      });
    }
  });

document.querySelectorAll(".input-box input").forEach((ip) => {
  ip.addEventListener("input", () => {
    document.querySelectorAll(".errorlogin").forEach((ep) => {
      ep.textContent = "";
      ep.style.display = "none";
    });
  });
});
