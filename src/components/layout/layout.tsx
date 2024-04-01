import {Outlet} from "react-router-dom";

export function Layout() {
    return (
        <div className="bg-neutral-900 min-h-[100dvh] flex flex-col items-center justify-between text-gray-300 h-full">
            <main className="py-6 h-full">
                <Outlet />
            </main>
            <footer className="py-5 text-gray-500 text-xs">
                Developed by{" "}
                <a href="https://www.linkedin.com/in/kevinbre/" rel="noreferrer" target="_blank">
                    Kevin Bredelis
                </a>
            </footer>
        </div>
    );
}
