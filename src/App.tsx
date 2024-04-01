import {Route, Routes} from "react-router-dom";

import {Home} from "./pages/home";
import {Layout} from "./components/layout/layout";
import {Roulette} from "./pages/roulette";

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route element={<Home />} path="/" />
                <Route element={<Roulette />} path="/roulette" />
            </Route>
        </Routes>
    );
}

export default App;
