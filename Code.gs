function syncCalendars() {
  const personalCalendarId = "jirulak02@gmail.com";
  const workCalendarId = "primary";
  const eventInfo = {
    summary: "OOO",
    eventType: "outOfOffice",
    visibility: "public",
    outOfOfficeProperties: {
      autoDeclineMode: "declineNone", // declineAllConflictingInvitations, declineOnlyNewConflictingInvitations
    },
    reminders: {
      useDefault: false,
      overrides: [],
    },
  };

  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + 30); // How many days in advance to monitor and block off time.

  const personalCalendar = CalendarApp.getCalendarById(personalCalendarId);
  const personalEvents = personalCalendar
    .getEvents(today, endDate)
    .filter(
      (event) => event.getVisibility() !== CalendarApp.Visibility.PRIVATE
    );

  const workCalendar = CalendarApp.getCalendarById(workCalendarId);
  const workEvents = workCalendar.getEvents(today, endDate);

  const workEventsFiltered = []; // To contain work calendar events that were previously created from personal calendar.
  const workEventsExisted = []; // To contain work calendar events that already correctly existed.
  const workEventsCreated = []; // To contain work calendar events that were created.
  const workEventsDeleted = []; // To contain work calendar events previously created that have been deleted from personal calendar.

  Logger.log("Number of work events: " + workEvents.length);
  Logger.log("Number of personal events: " + personalEvents.length);

  // Create filtered list of existing work calendar events that were previously created from the personal calendar.
  for (const workEvent of workEvents) {
    if (workEvent.getTitle() === eventInfo.summary) {
      workEventsFiltered.push(workEvent);
    }
  }

  for (const personalEvent of personalEvents) {
    let existed = false;

    // Check if copy of personal event already exists in the work calendar.
    for (const workEvent of workEventsFiltered) {
      if (
        workEvent.getStartTime().getTime() ===
          personalEvent.getStartTime().getTime() &&
        workEvent.getEndTime().getTime() ===
          personalEvent.getEndTime().getTime()
      ) {
        workEventsExisted.push(workEvent.getId());
        existed = true;
      }
    }

    if (existed) continue;

    // Create the event in the work calendar.
    const createdEvent = createEvent(workCalendarId, eventInfo, personalEvent);
    if (createdEvent) {
      workEventsCreated.push(createdEvent.id);
    }
  }

  // If a work event previously created no longer exists in the personal calendar, delete it.
  for (const workEvent of workEventsFiltered) {
    const workEventId = workEvent.getId();

    if (!workEventsExisted.includes(workEventId)) {
      try {
        workEvent.deleteEvent();
        workEventsDeleted.push(workEventId);
      } catch (e) {
        Logger.log("Failed to delete event: " + e.message);
      }
    }
  }

  Logger.log("Work events previously created: " + workEventsFiltered.length);
  Logger.log("Work events already correct: " + workEventsExisted.length);
  Logger.log("Work events created: " + workEventsCreated.length);
  Logger.log("Work events deleted: " + workEventsDeleted.length);
}

function createEvent(calendarId, eventInfo, eventToCopy) {
  const newEvent = {
    ...eventInfo,
    start: {
      dateTime: eventToCopy.getStartTime().toISOString(),
    },
    end: {
      dateTime: eventToCopy.getEndTime().toISOString(),
    },
  };

  try {
    const createdEvent = Calendar.Events.insert(newEvent, calendarId);
    return createdEvent;
  } catch (e) {
    Logger.log("Failed to create event: " + e.message);
  }

  return null;
}
