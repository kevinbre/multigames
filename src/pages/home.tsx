import {Link} from "react-router-dom";

import {GAMES} from "@/mock/games";

export function Home() {
    return (
        <div className="flex justify-center w-full">
            <div className="container flex flex-col items-center w-full">
                <h2 className="text-center font-bold">Games</h2>
                <div className="relative w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center items-center gap-2">
                    {GAMES.map((game) => (
                        <Link
                            key={game.id}
                            className={`p-4 overflow-hidden rounded-md w-full min-h-36 bg-center flex items-center justify-center transition-all hover:scale-95 font-bold grayscale hover:grayscale-0 text-3xl cursor-pointer select-none active:scale-90`}
                            to={game.path}
                        >
                            <div
                                className="absolute -z-20 top-0 bg-center w-full h-full "
                                style={{
                                    backgroundImage: `url(${game.image})`,
                                    boxShadow: "inset 0 150px 10px rgba(0, 0, 0, 0.5)",
                                }}
                            />
                            <span>{game.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
