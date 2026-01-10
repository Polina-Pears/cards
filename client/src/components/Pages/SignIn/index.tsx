import React, { useState } from "react";
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import style from './signin.module.scss'
import { useAuthStore } from "../../../store/useAuth";

function SignIn() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [errorLogin, setErrorLogin] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorServer, setErrorServer] = useState("");
    const navigate = useNavigate();
    const auth = useAuthStore();
    
    const authMutation = useMutation({
        mutationFn: (body: { login: string; password: string }) => auth.signin(body),
        onSuccess: () => { 
            navigate('/', { replace: true });
        },
        onError: (error: any) => {
            setErrorServer(error.message || 'Ошибка сервера');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const passwordValid = login.trim().length > 0;
        const loginValid = login.trim().length > 0;

        if (!loginValid) {
            setErrorLogin("Заполните логин");
        }

        if (!passwordValid) {
            setErrorPassword("Заполните пароль");
        }

        if (!passwordValid || !loginValid) {
            return;
        }

        authMutation.mutate({ login, password });
    }

    return (
        <div className={style.box}>
            <form onSubmit={handleSubmit} className={style.form}>
                <h1>Войти</h1>
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
                        label="Пароль"
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        error={errorPassword}
                        name="password"
                    />
                </div>
                {errorServer && <div style={{ color: 'red' }}>{errorServer}</div>}
                <div>
                    <Button
                        type="submit"
                        disabled={authMutation.isPending}
                    >
                        {authMutation.isPending ? 'Вход...' : 'Отправить'}
                    </Button>
                </div>
                <div>
                    <a href="http://85.198.87.33:3000/api/auth/yandex">Войти через Яндекс</a>
                </div>
            </form>
        </div>
    );
}

export default SignIn;