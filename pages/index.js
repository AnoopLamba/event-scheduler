import Calender from "@/components/Calender";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <>
      <ToastContainer autoClose={2500} />
      <Calender />
    </>
  );
}
