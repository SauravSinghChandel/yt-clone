import Image from "next/image";
import styles from "./page.module.css";
import { ToastContainer } from "react-toastify";


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      <p> Hello World! </p>
      <ToastContainer />
      </main>
    </div>
  );
}
