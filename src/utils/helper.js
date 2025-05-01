export function setButtonText(
  Btn,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    Btn.textContent = loadingText;
    console.log("setting text to " + loadingText);
  } else {
    Btn.textContent = defaultText;
    console.log("setting text to " + defaultText);
  }
}
