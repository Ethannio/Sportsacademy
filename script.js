document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById("form-status");
  const submitButton = form.querySelector('button[type="submit"]');

  const googleFormData = new FormData();
  googleFormData.append("entry.1177958296", form.elements.name.value);
  googleFormData.append("entry.897073759", form.elements.email.value);
  googleFormData.append("entry.1104582622", form.elements.mobile.value);
  googleFormData.append("entry.1732726771", form.elements.sport.value);
  googleFormData.append("entry.263685281", form.elements.message.value);

  submitButton.disabled = true;
  status.textContent = "Sending your inquiry…";

  fetch("https://docs.google.com/forms/d/e/1FAIpQLSfzoHvtUVnbqBlWPzErN0HP0H3vkiiwiCJGQnWgPodMcOrRYw/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: googleFormData,
  })
    .then(() => {
      status.textContent = "Thanks! Your inquiry has been sent.";
      form.reset();
    })
    .catch(() => {
      status.textContent = "We could not send your inquiry. Please try again.";
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});
