import { GoogleGenerativeAI } from "https://cdn.skypack.dev/@google/generative-ai";

const input = document.querySelector("#todo-input");
let i = 0;

const genAI = new GoogleGenerativeAI("AIzaSyCucxVITFLzABjXpJM0Lli9Vkc3sjPVKXc");

document.addEventListener("DOMContentLoaded", function () {
  const chatWindow = document.getElementById("chat-window");
  chatWindow.style.display = "none";
  chatWindow.style.height = "0";
  document.querySelector("#submit").addEventListener("click", () => {
    const inputData = input.value.trim();

    if (inputData === "") {
      return;
    }

    input.value = "";

    const todo_el = document.createElement("div");
    todo_el.classList.add("todo-item");

    const todo_content_el = document.createElement("div");
    todo_el.appendChild(todo_content_el);

    const todo_input_el = document.createElement("input");
    todo_input_el.classList.add("text");
    todo_input_el.type = "text";
    todo_input_el.value = inputData;
    todo_input_el.setAttribute("readonly", "readonly");
    todo_input_el.id = `task-${i}`;

    todo_content_el.appendChild(todo_input_el);

    const todo_actions_el = document.createElement("div");
    todo_actions_el.classList.add("action-items");

    const todo_tips = document.createElement("i");
    todo_tips.classList.add("fa-solid", "fa-search");
    todo_tips.id = `tips-${i}`;
    todo_tips.title = "Get Tips";

    const todo_done_el = document.createElement("i");
    todo_done_el.classList.add("fa-solid", "fa-check");
    todo_done_el.title = "Mark as Done";

    const todo_edit_el = document.createElement("i");
    todo_edit_el.classList.add("fa-solid", "fa-pen-to-square", "edit");
    todo_edit_el.title = "Edit Task";

    const todo_delete_el = document.createElement("i");
    todo_delete_el.classList.add("fa-solid", "fa-trash");
    todo_delete_el.title = "Delete Task";

    todo_actions_el.appendChild(todo_tips);
    todo_actions_el.appendChild(todo_done_el);
    todo_actions_el.appendChild(todo_edit_el);
    todo_actions_el.appendChild(todo_delete_el);

    todo_el.appendChild(todo_actions_el);

    document.querySelector(".todo-lists").appendChild(todo_el);

    // Done functionality
    todo_done_el.addEventListener("click", () => {
      todo_input_el.classList.add("done");
      todo_el.removeChild(todo_actions_el);
    });

    // Edit functionality
    todo_edit_el.addEventListener("click", () => {
      if (todo_edit_el.classList.contains("edit")) {
        todo_edit_el.classList.remove("edit", "fa-pen-to-square");
        todo_edit_el.classList.add("fa-x", "save");
        todo_input_el.removeAttribute("readonly");
        todo_input_el.focus();
      } else {
        todo_edit_el.classList.remove("save", "fa-x");
        todo_edit_el.classList.add("fa-pen-to-square", "edit");
        todo_input_el.setAttribute("readonly", "readonly");
      }
    });

    // Delete functionality
    todo_delete_el.addEventListener("click", () => {
      document.querySelector(".todo-lists").removeChild(todo_el);
    });

    // Tips functionality
    todo_tips.addEventListener("click", async () => {
      await generateTips(todo_input_el.id);
    });

    i++; // Increment the ID counter for the next item
  });

  document.querySelector(".hlp").addEventListener("click", function () {
    const chatWindow = document.getElementById("chat-window");
    const chatBody = document.querySelector(".chat-body");

    chatWindow.style.display = "block";
    chatWindow.style.height = "60%"; // Reset height to ensure proper expansion
    chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the bottom to show the latest messages
  });

  // Hide chat window when close button is clicked
  document.getElementById("close-chat").addEventListener("click", function () {
    const chatWindow = document.getElementById("chat-window");

    chatWindow.style.display = "none";
    chatWindow.style.height = "0"; // Reset height to prevent any overflow issues
  });

  // Send message when the "Send" button is clicked
  document
    .querySelector(".chat-input button")
    .addEventListener("click", async function () {
      const chatInput = document.querySelector(".chat-input #jnde");
      const message = chatInput.value.trim();

      if (message === "") return; // Don't do anything if input is empty

      // Add user's message to chat body
      const chatBody = document.querySelector(".chat-body");
      const userMessage = document.createElement("p");
      userMessage.textContent = `You: ${message}`;
      userMessage.classList.add("chat-message");
      chatBody.appendChild(userMessage);

      // Add a line break after the user's message
      chatBody.appendChild(document.createElement("br"));

      // Clear the input field
      chatInput.value = "";

      // Get response from Google Generative AI
      const prompt = `check this code and describe IN # LINES ONLY numbered 1. complexity,2. if it works properly, 3. if it can be better, without a lot of details SMALL INFOS and without titles, each in a separate paragraph(two new lines between each step) ${message}`;
      const model = await genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });
      const result = await model.generateContent(prompt);
      const response = await result.response.text();

      // Add the bot's response to chat body
      const botMessage = document.createElement("p");
      botMessage.textContent = `Bot: ${response}`;
      botMessage.classList.add("chat-message", "bot-message");
      chatBody.appendChild(botMessage);

      // Scroll chat to the bottom
      chatBody.scrollTop = chatBody.scrollHeight;
    });
});

// Tips functionality to generate tips for a specific task
async function generateTips(taskId) {
  const taskInput = document.getElementById(taskId);
  const task = taskInput.value;

  const prompt = `return 5 tips about ${task}, each tip in a small line and start with a number without any title or explanation`;

  const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const text = await result.response.text();

  // Display the tips in the textarea
  document.getElementById("tips-textarea").value = text;
}
