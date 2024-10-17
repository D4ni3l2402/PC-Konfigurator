import { Link, useNavigate } from "react-router-dom";

// import './Login.css'
import axios from "axios";
import { useState } from "react";
import LoginCSS from './Login.module.css'


function Login() {

    const navigate = useNavigate();
    // const authContext = useContext(AuthContext);

    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // const  isLoggedIn = authContext?.isLoggedIn;
    // const  setLogin = authContext?.setLogin;

    const [error, setError] = useState<boolean>(false);


    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            let response = axios.post('http://localhost:3300/login', { userName, password });
            sessionStorage.setItem('isLoggedIn', JSON.stringify(true));
            getUserDetails(userName);
            console.log((await response).data);
            navigate('/');
        } catch (error) {
            console.error("Fehler bei der anmeldung!")
            setError(true);
        }
    }

    async function getUserDetails(userName: string) {
        axios.get(`http://localhost:3300/userDetails/${userName}`).then(response => {
            sessionStorage.setItem('userDetails', JSON.stringify(response.data));

        });

    }

    // useEffect(() => {
    //     const details: any = sessionStorage.getItem('isLoggedIn');
    //     if(details != null){
    //         setLogin?.(true);
    //         console.log(details);
    //         console.log("is Loggedin? " + isLoggedIn);
    //     }
    // }, [isLoggedIn])

    // function check(): void {
    //     console.log(userName);
    //     sessionStorage.removeItem('userDetails');
    // }

    let sessLoggin = sessionStorage.getItem('isLoggedIn');
    let isLoggedIn;
    if (sessLoggin != null) { isLoggedIn = JSON.parse(sessLoggin); }

    return (
        <>
            <div className={LoginCSS.wrapper}>
                <div className={LoginCSS.loginContainer}>
                    <h2>Einloggen</h2>
                    <form className={LoginCSS.form} onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="userName" className={LoginCSS.userNameText}>Username:</label>
                        </div>
                        <div>
                            <input type="text" id="userName" className={LoginCSS.userName} required onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password" className={LoginCSS.passwordText}>Password:</label>
                        </div>
                        <div>
                            <input type="password" id="password" className={LoginCSS.password} onChange={(e) => setPassword(e.target.value)}></input>
                        </div>
                        <div>
                            <button type="submit">Anmelden</button>
                        </div>

                        <div>
                            <p>Noch kein Konto?</p>
                            <Link to={'/register'}>Bitte hier registrieren.</Link>
                        </div>
                    </form>
                    {error && (
                        <div className={LoginCSS.failedLog}>
                            Fehler bei der Anmeldung. Versuche es erneut!
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Login;