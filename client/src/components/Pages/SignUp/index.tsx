import React, { useState } from "react";
import { useMutation } from '@tanstack/react-query'
// import { useNavigate } from 'react-router-dom'
import Button from "../../UI/Button";
import Input from "../../UI/Input";
import signupApi from './signupApi'

function SignUp() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    // const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (body: { login: string; password: string }) => signupApi(body),
        onSuccess: (data) => {
            console.log(data);
            // if (data.token) {
            //     localStorage.setItem('token', data.token);
            // }
            // navigate('/', { replace: true });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ login, password });
    }

    return (
        <div>
            <div>Регистрация</div>
            <form onSubmit={handleSubmit}>
                <div>
                    <Input
                        label="Логин"
                        value={login}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)}
                    />
                </div>
                <div>
                    <Input
                        label="Пароль"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </div>
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