// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// alert for delete button in reviews
const alertPlaceholder = document.getElementById("liveAlertPlaceholder-reviewDelete");
const alertTrigger = document.getElementById("liveAlertBtn");
if (alertTrigger) {
  alertTrigger.addEventListener("click", () => {
    alertPlaceholder.style.display = "block";
    if (alertPlaceholder.style.display = "block") {
      document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
          document.querySelector(".deleteForm").submit();
        });
    }
  });
}


// alert for delete button in listing in show.ejs
const alertListingPlaceholder = document.getElementById("liveAlertPlaceholder-listing");
const alertListingTrigger = document.getElementById("liveAlertBtn-listing");
if (alertListingTrigger) {
  alertListingTrigger.addEventListener("click", () => {
    alertListingPlaceholder.style.display = "block";
    if (alertListingPlaceholder.style.display = "block") {
      document.getElementById("confirmDeleteBtn-listing").addEventListener("click", () => {
          document.querySelector(".DeleteForm-listing").submit();
        });
    }
  });
}
