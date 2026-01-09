import React, { useState } from "react";
import { useMutation } from '@tanstack/react-query'
import Button from "../../UI/Button";
import Input from "../../UI/Input";
// import signupApi from './signupApi'
import { useNavigate } from "react-router-dom";
import validateEmail from "../../../utils/validateEmail";
import { validatePassword } from "../../../utils/validatePassword";
import style from './signup.module.scss'
import EyeOff from "./../../../assets/icons/eye-closed.svg?react";
import EyeOn from "./../../../assets/icons/eye-open.svg?react";
import { useAuthStore } from "../../../store/useAuth";


function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorName, setErrorName] = useState("");
    const [errorLogin, setErrorLogin] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorServer, setErrorServer] = useState("");
    const auth = useAuthStore();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (body: { login: string; password: string, email: string, name: string }) => auth.signup(body),
        onSuccess: () => { 
            navigate('/', { replace: true });
        },
        onError: (error: any) => {
            setErrorServer(error.message || 'Ошибка сервера');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const emailValid = validateEmail(email);
        const passwordValid = validatePassword(password);
        const nameValid = name.trim().length > 0;
        const loginValid = login.trim().length > 0;

        if (!loginValid) {
            setErrorLogin("Заполните логин");
        }

        if (!nameValid) {
            setErrorName("Заполните имя");
        }

        if (!emailValid.valid) {
            setErrorEmail(emailValid.error);
        }

        if (!passwordValid.valid) {
            setErrorPassword(passwordValid.error);
        }

        if (!emailValid.valid || !passwordValid.valid || !nameValid || !loginValid) {
            return;
        }

        mutation.mutate({ login, password, email, name });
    }

    return (
        <div className={style.box}>
            <form onSubmit={handleSubmit} className={style.form}>
                <h1>Регистрация</h1>
                <div>
                    <Input
                        label="Имя"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        error={errorName}
                        name="name"
                    />
                </div>
                <div>
                    <Input
                        label="Логин"
                        value={login}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                        error={errorLogin}
                        name="login"
                    />
                </div>
                <div>
                    <Input
                        label="Электронная почта"
                        type="email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        error={errorEmail}
                        name="email"
                    />
                </div>
                <div className={style.passwordRow}>
                    <Input
                        containerClassName={style.passwordInput}
                        label="Пароль"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        type={passwordVisible ? 'text' : 'password'}
                        error={errorPassword}
                        name="password"
                    />
                    <Button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                        {passwordVisible ? (<EyeOff />) : (<EyeOn />)}
                    </Button>
                </div>
                {errorServer && <div style={{ color: 'red' }}>{errorServer}</div>}
                <div>
                    <Button
                        type="submit"
                        loading={mutation.isPending}
                    >
                        {mutation.isPending ? 'Регистрация...' : 'Отправить'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;