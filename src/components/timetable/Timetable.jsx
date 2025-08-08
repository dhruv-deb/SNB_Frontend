import React, { useMemo } from 'react';
import { CalendarOff } from 'lucide-react'; // A popular icon library used by shadcn/ui

const Timetable = ({ data }) => {
  // The order of days to be displayed
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Memoize the data processing to prevent re-computation on every render.
  // This groups classes by day and sorts them by time.
  const groupedTimetable = useMemo(() => {
    if (!data || data.length === 0) {
      return {};
    }

    const grouped = data.reduce((acc, item) => {
      const { day } = item;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(item);
      return acc;
    }, {});

    // Sort classes within each day by their start time
    for (const day in grouped) {
      grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    return grouped;
  }, [data]);

  const hasClasses = data && data.length > 0;

  return (
    // Card: The main container for the timetable component
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm font-sans">
      <div className="p-6">
        <h2 className="text-3xl font-bold tracking-tight">Weekly Timetable</h2>
      </div>
      
      <div className="p-6 pt-0">
        {hasClasses ? (
          // Grid: Responsive layout for the days of the week
          <div className="grid grid-cols-7 gap-x-4 gap-y-6">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold tracking-tight">{day}</h3>
                <div className="flex flex-col gap-4">
                  {groupedTimetable[day] && groupedTimetable[day].length > 0 ? (
                    groupedTimetable[day].map((item, index) => (
                      // Class Card: Individual class item with clean styling
                      <div
                        key={index}
                        className="bg-background p-4 rounded-lg border transition-all hover:shadow-md"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-lg font-semibold text-primary">
                            {item.startTime} - {item.endTime}
                          </span>
                          <p className="text-lg font-semibold text-card-foreground">
                            {item.courseName}
                          </p>
                          <p className="text-lg text-muted-foreground">
                            {item.courseCode} &middot; {item.location}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Placeholder for days with no classes
                    <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/20">
                      <p className="text-sm text-muted-foreground">No Classes</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State: Displayed when no timetable data is available
          <div className="flex flex-col items-center justify-center gap-3 text-center text-muted-foreground py-12">
            <CalendarOff className="h-10 w-10" />
            <h3 className="text-lg font-semibold">No Timetable Data</h3>
            <p className="text-sm">Timetable information is not available for this user.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;