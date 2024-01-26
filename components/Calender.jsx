import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns";
import { useEffect, useState } from "react";
import AddEventModal from "./AddEventModal";
import { CalenderLeftIcon, CalenderRightIcon } from "./common/Icon";
import Reminder from "./Reminder";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calender() {
  let today = startOfToday();
  let [isOpen, setIsOpen] = useState(false);
  let [inputEvent, setInputEvent] = useState("");
  let [reminders, setReminders] = useState([]);
  let [selectedDate, setSelectedDate] = useState("");
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  useEffect(() => {
    const localReminders = localStorage.getItem("reminders");

    if (localReminders) {
      setReminders(JSON.parse(localReminders));
    }
  }, []);

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  // This will return array of reminders for the selected month
  let selectedMonthReminders = reminders.filter((reminder) =>
    isSameMonth(reminder.date, currentMonth)
  );

  console.log("selectedMonthReminders are this:", selectedMonthReminders);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setIsOpen(true);
    setSelectedDate(day);
  };

  return (
    <>
      {/* Event Modal Popup*/}
      <AddEventModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        inputEvent={inputEvent}
        setInputEvent={setInputEvent}
        selectedDate={selectedDate}
        reminders={reminders}
        setReminders={setReminders}
      />

      <div className="pt-16 font-poppins">
        <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
          <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
            {/* Calender */}
            <div className="md:pr-14">
              <div className="flex items-center">
                <h2 className="flex-auto text-lg text-[#14238A] font-bold">
                  {format(firstDayCurrentMonth, "MMMM yyyy")}
                </h2>
                <button
                  type="button"
                  onClick={previousMonth}
                  className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Previous month</span>
                  <CalenderLeftIcon className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  onClick={nextMonth}
                  type="button"
                  className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Next month</span>
                  <CalenderRightIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="grid grid-cols-7 mt-10 text-lg font-medium text-center text-[#575757]">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div className="grid grid-cols-7 mt-2 text-sm">
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString()}
                    className={classNames(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      "py-1.5 text-lg"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleDayClick(day)}
                      className={classNames(
                        isEqual(day, selectedDay) && "text-white",
                        !isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "text-red-500",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-900",
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          "text-gray-400",
                        isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "bg-red-500",
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          "bg-gray-900",
                        !isEqual(day, selectedDay) && "hover:bg-gray-200",
                        (isEqual(day, selectedDay) || isToday(day)) &&
                          "font-semibold",
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </button>

                    <div className="w-1 h-1 mx-auto mt-1">
                      {reminders.some((reminder) =>
                        isSameDay(reminder.date, day)
                      ) && (
                        <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remainders for selected month */}
            <section className="mt-12 md:mt-0 md:pl-14">
              <h2 className="font-medium text-xl text-black">Revisions</h2>
              <ol className="mt-[22px] divide-y-[1px] divide-[#C4C4C4]">
                {selectedMonthReminders.length > 0 ? (
                  selectedMonthReminders.map((reminder) => (
                    <Reminder reminder={reminder} key={reminder.id} />
                  ))
                ) : (
                  <p className="text-sm leading-6 text-gray-500">
                    No revisions for this month.
                  </p>
                )}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
