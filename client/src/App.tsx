import { Link, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// ленивые версии компонентов
const Home = lazy(() => import("./components/Pages/Home"));
const SignIn = lazy(() => import("./components/Pages/SignIn"));
const SignUp = lazy(() => import("./components/Pages/SignUp"))

function App() {

  return (
    <>
      <div>
        <nav>
          <Link to="/">Главная</Link>
          <Link to="/signIn">Войти</Link>
          <Link to="/signUp">Регистрация</Link>
        </nav>
      </div>
      <Suspense fallback={<div>Загрузка страницы...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
