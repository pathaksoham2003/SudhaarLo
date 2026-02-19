import React, { useRef, useMemo } from "react";
import { Box, Paper, useTheme } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import "./SapCalendar.css";

/**
 * SapCalendar
 *
 * A theme-aware calendar component built on FullCalendar.
 * Automatically adapts to the current MUI theme mode (light / dark)
 * and uses the project's primary colour for events and buttons.
 *
 * Ships with four views out of the box:
 *   - Month  (dayGridMonth)
 *   - Week   (timeGridWeek)
 *   - Day    (timeGridDay)
 *   - List   (listWeek)
 *
 * All extra FullCalendar props are forwarded, so you can
 * customise everything documented at https://fullcalendar.io/docs
 *
 * @param {Array}    events          - Event objects ({ title, start, end, ... })
 * @param {string}   initialView     - Starting view (default: "dayGridMonth")
 * @param {boolean}  editable        - Allow drag & resize (default: false)
 * @param {boolean}  selectable      - Allow date range selection (default: false)
 * @param {object}   headerToolbar   - Custom toolbar config
 * @param {string|number} height     - Calendar height (default: "auto")
 * @param {boolean}  nowIndicator    - Show current-time line (default: true)
 * @param {boolean}  weekNumbers     - Show week numbers (default: false)
 * @param {string}   noEventsMessage - Empty list-view placeholder
 * @param {Function} onDateClick     - Callback when a date cell is clicked
 * @param {Function} onEventClick    - Callback when an event is clicked
 * @param {Function} onEventDrop     - Callback after drag-and-drop
 * @param {Function} onEventResize   - Callback after event resize
 * @param {Function} onSelect        - Callback after date range selection
 * @param {Function} onEventsSet     - Callback when the event set changes
 * @param {boolean}  wrapInPaper     - Wrap calendar in an MUI Paper card (default: true)
 * @param {object}   sx              - Additional MUI sx styles for the wrapper
 */
const SapCalendar = ({
  events = [],
  initialView = "dayGridMonth",
  editable = false,
  selectable = false,
  headerToolbar,
  height = "auto",
  nowIndicator = true,
  weekNumbers = false,
  noEventsMessage = "No events to display",
  onDateClick,
  onEventClick,
  onEventDrop,
  onEventResize,
  onSelect,
  onEventsSet,
  wrapInPaper = true,
  sx = {},
  ...fullCalendarProps
}) => {
  const theme = useTheme();
  const calendarRef = useRef(null);
  const isDark = theme.palette.mode === "dark";

  // Map MUI theme tokens → FullCalendar CSS custom properties
  const themeVars = useMemo(
    () => ({
      "--fc-border-color": isDark
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.1)",
      "--fc-page-bg-color": theme.palette.background.default,
      "--fc-neutral-bg-color": isDark
        ? "rgba(255,255,255,0.04)"
        : "rgba(0,0,0,0.02)",
      "--fc-today-bg-color": isDark
        ? "rgba(202,21,81,0.10)"
        : "rgba(202,21,81,0.06)",
      "--fc-event-bg-color": theme.palette.primary.main,
      "--fc-event-border-color": theme.palette.primary.main,
      "--fc-event-text-color": "#ffffff",
      "--fc-button-bg-color": theme.palette.primary.main,
      "--fc-button-border-color": theme.palette.primary.main,
      "--fc-button-hover-bg-color": isDark ? "#a81245" : "#b31349",
      "--fc-button-hover-border-color": isDark ? "#a81245" : "#b31349",
      "--fc-button-active-bg-color": isDark ? "#8e1040" : "#9a1142",
      "--fc-button-active-border-color": isDark ? "#8e1040" : "#9a1142",
      "--fc-list-event-hover-bg-color": isDark
        ? "rgba(255,255,255,0.06)"
        : "rgba(0,0,0,0.04)",
      "--fc-non-business-color": isDark
        ? "rgba(255,255,255,0.03)"
        : "rgba(0,0,0,0.03)",
      "--fc-highlight-color": isDark
        ? "rgba(202,21,81,0.18)"
        : "rgba(202,21,81,0.12)",
    }),
    [isDark, theme.palette]
  );

  const defaultToolbar = {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  };

  const calendarContent = (
    <Box
      className={`sap-calendar ${isDark ? "sap-calendar--dark" : "sap-calendar--light"}`}
      style={themeVars}
      sx={{
        "& .fc": { fontFamily: theme.typography.fontFamily },
        ...sx,
      }}
    >
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={headerToolbar || defaultToolbar}
        events={events}
        editable={editable}
        selectable={selectable}
        nowIndicator={nowIndicator}
        weekNumbers={weekNumbers}
        dayMaxEvents={true}
        height={height}
        noEventsContent={noEventsMessage}
        dateClick={onDateClick}
        eventClick={onEventClick}
        eventDrop={onEventDrop}
        eventResize={onEventResize}
        select={onSelect}
        eventsSet={onEventsSet}
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "List",
        }}
        {...fullCalendarProps}
      />
    </Box>
  );

  if (!wrapInPaper) return calendarContent;

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 1.5, sm: 2.5 },
        borderRadius: 3,
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
      }}
    >
      {calendarContent}
    </Paper>
  );
};

export default SapCalendar;
