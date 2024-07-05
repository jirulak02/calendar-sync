# calendar-sync - 2024

This is a script to sync your personal Google Calendar with your work Google Calendar. It creates out of office events in your work calender, so your co-workers know when you are not available without providing any other details about your personal events.

## Setup

1. Go to your personal calendar settings and share your calendar with your work email.

- Click the three dots next to your calendar and select `Settings and sharing`.
- Under `Share with specific people`, click `Add people`.
- Enter your work email address and select `See all event details`.

2. Create a new Google Apps Script in your work Google Drive.
3. Copy the content of `Code.gs` into the script editor.
4. Change the `personalCalendarId` to your personal calendar id (for main account calendar, it will be your email address), which you can find in the same settings page where you shared your calendar.
5. Customize the `eventInfo` object if you'd like.
6. Add the `Google Calendar API` in the `Services` menu.
7. Create a new trigger for the function `syncCalendar` to run whenever your personal calendar updates.

Jiří Šimeček
