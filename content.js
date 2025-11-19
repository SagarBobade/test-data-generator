(function () {
  let selectedInputElement = null;

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (
      (target.tagName === "INPUT" || target.tagName === "TEXTAREA") &&
      !target.disabled && // Ensure element is editable
      !target.readOnly && // Ensure it’s not read-only
      target.isConnected // Ensure it’s still in the DOM
    ) {
      selectedInputElement = target;
    } else {
      selectedInputElement = null; // Clear if invalid
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (
      message.action === "setInputValue" &&
      selectedInputElement &&
      typeof message.data === "string" // Validate data type
    ) {
      selectedInputElement.value = message.data.slice(0, 1000); // Limit length to prevent abuse
      const inputEvent = new Event("input", { bubbles: true });
      const changeEvent = new Event("change", { bubbles: true });
      selectedInputElement.dispatchEvent(inputEvent);
      selectedInputElement.dispatchEvent(changeEvent);
    }
    sendResponse({ success: !!selectedInputElement }); // Send feedback
  });
})();