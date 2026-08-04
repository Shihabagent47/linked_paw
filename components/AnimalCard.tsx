import { Animal } from "@/data/animals";
import Image from "next/image";

type Props = {
  animal: Animal;
};

export default function AnimalCard({ animal }: Props) {
  return (
    <div className="w-96 rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-200">
      <div className="relative h-48 w-full bg-blue-100">
        <Image
          src={animal.photo}
          alt={animal.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="px-6 pb-6">
        <div className="relative -mt-10 mb-3">
          <div className="relative w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow">
            <Image
              src={animal.photo}
              alt={animal.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900">{animal.name}</h2>
        <p className="text-sm text-gray-700">{animal.title}</p>
        <p className="text-sm text-gray-500">{animal.company}</p>
        <p className="text-xs text-gray-400 mt-1">📍 {animal.location} · {animal.species}</p>
        <p className="text-xs text-gray-400">{animal.connections.toLocaleString()} connections</p>

        <p className="mt-4 text-sm text-gray-600 line-clamp-3">{animal.about}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {animal.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
