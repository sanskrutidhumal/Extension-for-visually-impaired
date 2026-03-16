
chrome.runtime.onInstalled.addListener(() => {
  console.log('AccessiVoice extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'tts') {
    chrome.tts.speak(message.text, {
      rate: message.rate || 1.0,
      pitch: message.pitch || 1.0,
      volume: message.volume || 1.0,
      onEvent: (event) => {
        if (event.type === 'end' || event.type === 'error') {
          sendResponse({ done: true });
        }
      }
    });
    return true;
  }
  if (message.action === 'ttsStop') {
    chrome.tts.stop();
    sendResponse({ done: true });
  }
});
