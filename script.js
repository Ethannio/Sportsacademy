document.getElementById("year").textContent = new Date().getFullYear();

const coachMessages = document.getElementById("coach-messages");
const coachForm = document.getElementById("coach-form");
const coachQuestion = document.getElementById("coach-question");
const sportFinderForm = document.getElementById("sport-finder-form");
let knowledgeBase = [];

function parseKnowledgeBase(text) {
  return text.trim().split("\n\n").map((entry) => {
    const [questionLine, ...answerLines] = entry.split("\n");
    return {
      question: questionLine.replace("Q: ", ""),
      answer: answerLines.join(" ").replace("A: ", ""),
    };
  });
}

fetch("sports-knowledge-base.txt")
  .then((response) => {
    if (!response.ok) throw new Error("Knowledge base could not be loaded");
    return response.text();
  })
  .then((text) => {
    knowledgeBase = parseKnowledgeBase(text);
  })
  .catch(() => {
    console.warn("Run the project through a local web server to load the Sports Compass knowledge base.");
  });

function addCoachMessage(message, sender) {
  const bubble = document.createElement("div");
  bubble.className = `coach-message coach-message--${sender}`;
  if (sender === "bot") {
    const avatar = document.createElement("span");
    avatar.className = "message-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "⚽";
    bubble.appendChild(avatar);
  }
  const text = document.createElement("p");
  text.textContent = message;
  bubble.appendChild(text);
  coachMessages.appendChild(bubble);
  coachMessages.scrollTop = coachMessages.scrollHeight;
}

function getCoachReply(question) {
  const text = question.toLowerCase();
  const queryWords = text.match(/[a-z]{3,}/g) || [];
  const bestMatch = knowledgeBase
    .map((entry) => ({
      ...entry,
      score: queryWords.filter((word) => entry.question.toLowerCase().includes(word)).length,
    }))
    .sort((first, second) => second.score - first.score)[0];

  if (bestMatch?.score >= 2) return bestMatch.answer;

  if (text.includes("8") || text.includes("year") || text.includes("age") || text.includes("suit")) {
    return "For an 8-year-old, Foundations is a great place to start. Soccer, basketball, swimming, and martial arts are popular options. The best choice depends on what they enjoy and their comfort level.";
  }
  if (text.includes("equipment") || text.includes("gear") || text.includes("need")) {
    return "For most first sessions, bring comfortable sports clothes, a water bottle, and suitable athletic shoes. Our coaches will confirm any sport-specific equipment before the program begins.";
  }
  if (text.includes("time") || text.includes("schedule") || text.includes("open")) {
    return "Academy timings are set by program and age group. Please contact us with your preferred sport and age group for the current schedule.";
  }
  if (text.includes("fee") || text.includes("cost") || text.includes("price")) {
    return "Fees vary by program and session length. Send us an inquiry through the contact form and we will share the current pricing.";
  }
  if (text.includes("register") || text.includes("sign") || text.includes("join") || text.includes("enroll")) {
    return "To register, complete the contact form below. Choose the sport you are interested in and our team will follow up with the next steps.";
  }
  return "I can help with sport suggestions, equipment, timings, fees, and registration. Try one of the suggested questions, or ask in your own words.";
}

function submitCoachQuestion(question) {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) return;
  addCoachMessage(trimmedQuestion, "user");
  addCoachMessage(getCoachReply(trimmedQuestion), "bot");
}

sportFinderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const { age, interest, goal } = form.elements;
  const recommendations = interest.value === "team play"
    ? "soccer, basketball, or volleyball"
    : interest.value === "individual challenges"
      ? "swimming, tennis, or martial arts"
      : interest.value === "being active outdoors"
        ? "soccer, cricket, or track & field"
        : "martial arts, swimming, or basketball";

  addCoachMessage(`Age ${age.value}; enjoys ${interest.value}; wants ${goal.value}.`, "user");
  addCoachMessage(`A strong starting point could be ${recommendations}. For this age range, begin with a Foundations-style session where the focus is enjoyment, safe skill building, and ${goal.value}. Use the contact form below and our coaches can recommend the best group.`, "bot");
  form.reset();
});

coachForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitCoachQuestion(coachQuestion.value);
  coachForm.reset();
  coachQuestion.focus();
});

document.querySelectorAll("[data-question]").forEach((button) => {
  button.addEventListener("click", () => submitCoachQuestion(button.dataset.question));
});

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
