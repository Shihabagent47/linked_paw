import { animals } from "@/app/data/animals";
import AnimalCard from "@/app/components/AnimalCard";

export default function Home() {
    const animal = animals[1];
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1>🐾 LinkedPaw</h1>
        
        <AnimalCard animal={animal}/>
    </div>
  );
}
