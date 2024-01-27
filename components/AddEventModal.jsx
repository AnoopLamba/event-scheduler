import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { toast } from "react-toastify";
import revisionService from "@/services/revisionService";

export default function AddEventModal(props) {
  const {
    isOpen,
    setIsOpen,
    inputEvent,
    setInputEvent,
    reminders,
    setReminders,
  } = props;

  const closeModal = () => {
    setIsOpen(false);
    setInputEvent("");
  };

  // will give next revision time depending on number of revisions completed
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

  // function to add events
  const handleAdd = async () => {
    try {
      const newRevision = {
        title: inputEvent,
        isCompleted: false,
        nextRevisionTime: nextRevisionTime(0),
        numberOfRevisionsCompleted: 0,
      };
      const { revision } = await revisionService.addRevision(newRevision);
      const newRevisions = [...reminders, revision];

      // Sorting the data based on nextRevisionTime in ascending order
      const sortedRevisions = newRevisions
        .slice()
        .sort(
          (a, b) => new Date(a.nextRevisionTime) - new Date(b.nextRevisionTime)
        );

      setReminders(sortedRevisions);
      setIsOpen(false);
      setInputEvent("");
      toast.dismiss();
      toast.success("Added successfully!");
    } catch (error) {
      console.log("Error adding!", error);
      toast.dismiss();
      return toast.error("Error adding!");
    }
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
