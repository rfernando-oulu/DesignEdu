import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  let href = userId ? "week-01" : "/new-user";

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
      <div className="w-full max-w-[600px]">
        <h1 className="text-6xl">Creative Design</h1>
        <p className="text-2xl text-white/60 mb-4">
        The basic concepts of idea genraiton, creative problem-solving, and design thinking methodologies.
        </p>
        <ul className="list-disc list-inside bg-gray-900 bg-opacity-60 backdrop-blur-md p-6 rounded-lg shadow-lg">
          <li className="mb-2 text-gray-300">
            Understand and implement in practice essential creative
            problem-solving and design thinking methodologies.
          </li>
          <li className="mb-2 text-gray-300">
            Systematically ideate and implement creative solutions to a problem,
            both independently and as a part of a team.
          </li>
          <li className="mb-2 text-gray-300">
            Identify, compare, and evaluate different aspects of creative
            solutions.
          </li>
          <li className="mb-2 text-gray-300">
            Apply creative design thinking and low-resolution prototyping, with
            emphasis on empathy, iterative strategies, user interactions, as
            well as feedback.
          </li>
        </ul>

        <div>
          <Link href={href}>
            <button className="bg-blue-600 px-4 py-2 rounded-lg text-xl">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
