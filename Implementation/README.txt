======================
 Testing Instructions
======================

(Please read instructions marked with an asterisk[*]. Those not marked with one should relatively be intuitive enough to perform on your own, but are still listed for clarity.)

--------------------------
 Starting the Application
--------------------------
1. Open Google Chrome.
2(*). Go to chrome://extensions.
3(*). Turn Developer Mode on.
4(*). Drag SP.crx into the Chrome window. Click "Add extension". (if dragging doesn't work, see 4.2).
4.2(*). Click on "Load unpacked" and select the SP folder.
5(*). Open any webpage with text input. If none available, open test.html (included in the .zip file).
6(*). Click the square icon with a white capitalized T inside to open the extension.
7. Follow the instructions to begin using the application.

-----------------------
 Using the Application
-----------------------
Instructions for this part can be done in any order, it just lists the activities required to do.
- Updating the predictor by pressing the Copy to Clipboard button
- Adding new words to the application by pressing the Update Predictor button
- Updating the predictor by casting an input to a pre-clicked text box (See [Casting Text to a Text Box] for detailed instructions)
- Typing words with punctuations (these punctuations are expected to be removed after updating the predictor)
- Adjusting the number of words to appear through Settings
- Selecting results from letter-level prediction (selecting a word in the middle of typing one)
- Selecting results from word-level prediction (selecting a word after typing one, plus a space)
- Clearing in the middle of typing
- Resetting the predictor (this will require you to do all the steps in [Starting the Application] again so be careful.)

----------------------------
 Casting Text to a Text Box
----------------------------
1(*). Before opening the popup window, click on a text box. Do note that the application only casts text to the following HTML
elements (these elements are displayed in order in test.html):
    - <textarea></textarea>
    - <input type="text"/>
    - <input type="search"/>
2. Go to the popup window.
3. Type a few words into the text box.
4. Click on "Cast to Text Box". The input you typed should be placed on the text box that you clicked in the webpage, replacing
any previous text inside it.

=============
 Survey Link
=============
https://docs.google.com/forms/d/16gJNkwFfOPTi-AjjB6sC9nrqrkef94S1VmON4y37xN4/
