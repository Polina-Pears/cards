import { Suspense, lazy, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import style from './App.module.scss'
import { useAuthStore } from "../../store/useAuth";

// ленивые версии компонентов
const Home = lazy(() => import("../Pages/Home"));
const SignIn = lazy(() => import("../Pages/SignIn"));
const SignUp = lazy(() => import("../Pages/SignUp"))

function App() {
  const auth = useAuthStore();

  useEffect(() => {
    auth.checkAuth();
  }, []);

  return (
    <div className={style.page}>
      <nav className={style.nav}>
        <Link to="/">Главная</Link>
        {
          auth.isAuth ? <span onClick={() => auth.signout()}>Выйти</span> : (
            <>
              <Link to="/signIn">Войти</Link>
              <Link to="/signUp">Регистрация</Link>
            </>
          )
        }
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
