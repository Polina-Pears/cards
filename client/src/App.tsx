import { Link, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import './style/global.scss'
import style from './style/app.module.scss'

// ленивые версии компонентов
const Home = lazy(() => import("./components/Pages/Home"));
const SignIn = lazy(() => import("./components/Pages/SignIn"));
const SignUp = lazy(() => import("./components/Pages/SignUp"))

function App() {

  return (
    <div className={style.page}>
      <nav className={style.nav}>
        <Link to="/">Главная</Link>
        <Link to="/signIn">Войти</Link>
        <Link to="/signUp">Регистрация</Link>
      </nav>
      <div>
        <Suspense fallback={<div>Загрузка страницы...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App
