import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { v4 as uuidv4 } from "uuid";

export default function AddEventModal(props) {
  const {
    isOpen,
    setIsOpen,
    inputEvent,
    setInputEvent,
    selectedDate,
    reminders,
    setReminders,
  } = props;

  function closeModal() {
    setIsOpen(false);
    setInputEvent("");
  }

  // function to add events
  const handleAdd = () => {
    setIsOpen(false);
    const newEvent = {
      id: uuidv4(),
      event: inputEvent,
      date: selectedDate,
    };

    const newReminders = [...reminders, newEvent];
    const orderedReminders = newReminders
      .slice()
      .sort((a, b) => a.date - b.date);
    setReminders(orderedReminders);
    localStorage.setItem("reminders", JSON.stringify(orderedReminders));
    setInputEvent("");
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto font-poppins">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add Event
                  </Dialog.Title>
                  <div className="mt-2">
                    <textarea
                      value={inputEvent}
                      onChange={(e) => setInputEvent(e.target.value)}
                      placeholder="Event"
                      className="w-full p-4 resize-none bg-gray-200 outline-none rounded-md"
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-start gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleAdd}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
