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
import { toast } from "react-toastify";
import revisionService from "@/services/revisionService";
import UpdateEventModal from "./UpdateEventModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calender() {
  let today = startOfToday();
  let [isOpen, setIsOpen] = useState(false);
  let [inputEvent, setInputEvent] = useState("");
  let [reminders, setReminders] = useState([]);
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  let [editingId, setEditingId] = useState("");
  let [editingReminder, setEditingReminder] = useState("");

  // to populate the revisions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { revisions } = await revisionService.getRevisions();

        if (revisions) {
          setReminders(revisions);
        }
      } catch (error) {
        console.log("error getting revisions: ", error);
        toast.dismiss();
        return toast.error("Error getting revisions!");
      }
    };

    fetchData();
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
    isSameMonth(reminder.nextRevisionTime, currentMonth)
  );

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  // this function will give next revision time depending on number of revisions completed
  const nextRevisionTime = (numberOfRevisionsCompleted) => {
    const currentTime = new Date();

    switch (numberOfRevisionsCompleted) {
      // adding 6 hours
      case 0:
        currentTime.setHours(currentTime.getHours() + 6);
        return currentTime;

      // adding 1 day between 1st and 2nd revision
      case 1:
        currentTime.setDate(currentTime.getDate() + 1);
        return currentTime;

      // adding 2 days between 2nd and 3rd revision
      case 2:
        currentTime.setDate(currentTime.getDate() + 2);
        return currentTime;

      // adding 5 days between 3rd and 4th revision
      case 3:
        currentTime.setDate(currentTime.getDate() + 5);
        return currentTime;

      // adding 7 days between 4th and 5th revision
      case 4:
        currentTime.setDate(currentTime.getDate() + 7);
        return currentTime;

      default:
        return;
    }
  };

  // function to handle editing of the revision
  const handleEdit = (title, id) => {
    setEditingReminder(title);
    setEditingId(id);
  };

  // function to delete the selected revision
  const handleDelete = async (id) => {
    try {
      if (window.confirm("Do you want to delete it?")) {
        await revisionService.deleteRevision(id);

        const newRevisions = reminders.filter((revision) => revision._id != id);
        setReminders(newRevisions);
        toast.dismiss();
        toast.info("Deleted successfully");
      }
    } catch (error) {
      console.log("Error deleting!", error);
      toast.dismiss();
      return toast.error("Error deleting!");
    }
  };

  // get revision with id
  const getRevisionWithId = async () => {
    try {
      const { revision } = await revisionService.getOneRevision(id);

      return revision;
    } catch (error) {
      console.log("Error getting one revision!", error);
      toast.dismiss();
      return toast.error("Error getting one revision!");
    }
  };

  // function to handle next revision time
  const handleMarkAsDone = async (id) => {
    try {
      const oldRevision = getRevisionWithId(id);
      if (oldRevision) {
        const newRevision = {
          nextRevisionTime: nextRevisionTime(
            oldRevision.numberOfRevisionsCompleted + 1
          ),
          numberOfRevisionsCompleted:
            oldRevision.numberOfRevisionsCompleted + 1,
        };
      }
    } catch (error) {
      console.log("Error marking as done!", error);
      toast.dismiss();
      return toast.error("Error marking as done!");
    }
  };

  return (
    <>
      {/* Event Modal Popup*/}
      <AddEventModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        inputEvent={inputEvent}
        setInputEvent={setInputEvent}
        reminders={reminders}
        setReminders={setReminders}
        nextRevisionTime={nextRevisionTime}
      />

      <UpdateEventModal
        editingId={editingId}
        setEditingId={setEditingId}
        editingReminder={editingReminder}
        setEditingReminder={setEditingReminder}
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
                          "font-semibold text-base",
                        "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                      )}
                    >
                      <time dateTime={format(day, "yyyy-MM-dd")}>
                        {format(day, "d")}
                      </time>
                    </button>

                    <div className="w-1 h-1 mx-auto mt-1">
                      {reminders.some((reminder) =>
                        isSameDay(reminder.nextRevisionTime, day)
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
              <div className="w-full flex items-center justify-between">
                <h2 className="font-medium text-xl text-black">Revisions</h2>
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-[6px_17px] rounded-[20px] bg-pink-500 text-white text-sm font-medium"
                >
                  Add
                </button>
              </div>
              <ol className="mt-2 divide-y-2">
                {selectedMonthReminders.length > 0 ? (
                  selectedMonthReminders.map((reminder) => (
                    <Reminder
                      reminder={reminder}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      handleMarkAsDone={handleMarkAsDone}
                      key={reminder._id}
                    />
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
