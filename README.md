# Extension-for-visually-impaired
Vision AI is a Chrome extension activated by “Hey Vision” that reads, summarizes pages and describes image
# AccessiVoice – Voice Controlled Chrome Extension

## Overview

AccessiVoice is a Chrome extension designed to help users interact with websites using voice commands. The extension listens for the wake word **“Hey Vision”** and then allows users to control different actions on a webpage without using a mouse or keyboard. It improves accessibility by allowing users to read page content, summarize information, navigate webpages, and describe images through voice interaction.

## Features

* Wake word activation using **“Hey Vision”**
* Voice-controlled website navigation
* Read webpage content aloud
* Summarize webpage text
* Describe images on webpages
* Scroll and navigate pages using voice
* Keyboard shortcuts for quick actions
* Simple popup interface for control
* AI-based image caption generation

## Project Files

The project contains the following main files:

* **manifest.json** – Configuration file that defines extension permissions and settings.
* **content.js** – Injected script responsible for voice recognition and command execution.
* **popup.html** – User interface displayed when the extension icon is clicked.
* **popup.js** – Script that manages popup functionality and commands.
* **icon16.png / icon48.png / icon128.png** – Icons used for the Chrome extension.

## Installation Steps

Follow these steps to install the extension manually in Google Chrome:

1. Download or copy the project folder to your computer.

2. Open Google Chrome.

3. Go to the Extensions page by typing:

   chrome://extensions/

4. Enable **Developer Mode** in the top right corner.

5. Click **Load Unpacked**.

6. Select the extension project folder.

7. The AccessiVoice extension will now appear in the browser.

## How to Use

1. Open any webpage in Chrome.

2. Activate the extension by saying:

   **“Hey Vision”**

3. After activation, speak a command such as:

   * Scroll down
   * Scroll up
   * Go back
   * Refresh page
   * Read page
   * Summarize page
   * Describe images
   * Find text
   * Sleep

The extension will process the command and perform the action on the current webpage.

## Keyboard Shortcuts

Users can also control the extension using keyboard shortcuts:

| Shortcut | Function                 |
| -------- | ------------------------ |
| Alt + A  | Activate assistant       |
| Alt + S  | Stop speech              |
| Alt + U  | Summarize page           |
| Alt + D  | Describe images          |
| Alt + ]  | Move to next heading     |
| Alt + [  | Move to previous heading |
| Alt + P  | Pause or resume speech   |

## Technologies Used

* JavaScript
* Chrome Extension Manifest V3
* Web Speech Recognition API
* Speech Synthesis API
* HTML and CSS
* AI image captioning service

## Purpose of the Project

The main objective of this extension is to make web browsing easier and more accessible. It allows users to interact with websites through voice commands, which can be especially helpful for people with visual impairments or limited mobility.

## Future Improvements

Possible improvements for the project include:

* Support for multiple languages
* More advanced AI summarization
* Conversational chatbot features
* Publishing the extension on the Chrome Web Store
* Better wake word detection
Author - Sanskruti Dhumal
