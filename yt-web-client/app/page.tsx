import Image from "next/image";
import styles from "./page.module.css";
import { getVideos } from "./utilities/firebase/functions";
import Link from "next/link";

export default async function Home() {
    const videos  = await getVideos();

  return (
    <div className={styles.page}>
    <main className={styles.main}>
    {
        videos.map((video) => (

            <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image src={'/thumbnail.png'} alt='video' width={120} height={80}
            className={styles.thumbnail}/>
            </Link>
        ))
    }
      </main>
    </div>
  );
}

export const revalidate = 30;
