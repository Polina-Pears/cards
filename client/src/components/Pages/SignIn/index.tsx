import Button from "../../UI/Button";
import Input from "../../UI/Input";

function SignIn() {
    return (
        <div>
            <div>Войти</div>
            <form>
                <div><Input label="Логин"/></div>
                <div><Input label="Пароль" type="password" /></div>
                <div><Button>Отправить</Button></div>
            </form>
        </div>
    );
}

export default SignIn;