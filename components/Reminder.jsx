import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "./common/Icon";
import { format } from "date-fns";
import { Fragment } from "react";

function Reminder(props) {
  const { reminder, handleDelete, handleEdit, handleMarkAsDone } = props;

  return (
    <li className="py-4 px-3 flex items-start justify-between gap-4 group focus-within:bg-green-50 focus-within:rounded-lg">
      <div className="w-full flex flex-col items-start justify-center gap-2">
        {/* number of revisions completed and the time */}
        <div className="flex items-center justify-start gap-2">
          <div className="p-[6px_17px] rounded-[20px] bg-yellow-400 text-white text-sm font-medium">
            <span>{reminder.numberOfRevisionsCompleted}</span>
          </div>
          <div className="p-[6px_17px] rounded-[20px] bg-[#40DFCD] text-white text-sm font-medium">
            {format(reminder.nextRevisionTime, "MMM dd, yyyy HH:mm a")}
          </div>
        </div>

        {/* revision title */}
        <p className="text-gray-900">{reminder.title}</p>
      </div>

      {/* options like edit, delete, mark as done */}
      <Menu
        as="div"
        className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100 "
      >
        <div>
          <Menu.Button className="flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
            <DotsVerticalIcon className="w-6 h-6" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-2xl w-36 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleEdit(reminder.title, reminder._id)}
                  className={`w-full flex justify-start ${
                    active ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  } px-4 py-3 text-sm`}
                >
                  Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleDelete(reminder._id)}
                  className={`w-full flex justify-start ${
                    active ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  } px-4 py-3 text-sm`}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => handleMarkAsDone(reminder._id)}
                  className={`w-full flex justify-start ${
                    active ? "bg-gray-200 text-gray-900" : "text-gray-700"
                  } px-4 py-3 text-sm`}
                >
                  Mark as done
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </li>
  );
}

export default Reminder;
