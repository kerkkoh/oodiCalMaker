# Oodi Calendar Maker
A solution to the WebOodi calendar problem thrown together in a few days. Works as a Google Chrome extension, but you can probably rip some of the scripts out and try to run them without the extension.

Basic functionality is that the extension once initiated, by pressing one button, will scan through your courses on Oodi and pick out the relevant information from the courses you are enrolled in. After this, the extension will do some conversion work with ics.js and generate a calendar.ics file that includes all the courses and exercises picked out before.

You can import this ics (ICAL) file into most modern calendar programs such as iCalendar, Google Calendar, etc.

The extension takes into account recurring events and single events in oodi and it seems to be fairly accurate from the tests I've ran.

## License
Oodi Calendar Maker is licensed under the MIT License.

## Usage
1. Edit "config.js" and edit the string on line 8 to be the url of your organization's WebOodi installation.
2. Install the extension in chrome://extensions/ (You need to enable developer mode)
3. Open WebOodi and log in
4. Go to My courses > Registrations
5. Press the extension's "C" icon in the chrome toolbar on the right
6. Read the instructions on the popup window.
7. Press the "Start Export" button and don't switch tabs on chrome or do anything else for that matter until you can see "Status: READY"
8. You should now have a calendar.ics in your default Downloads folder
9. Import the calendar.ics file into your calendar of choice
