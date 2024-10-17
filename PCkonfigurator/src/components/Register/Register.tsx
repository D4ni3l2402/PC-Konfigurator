
import { Link, useNavigate } from 'react-router-dom';
// import './Register.css'
import { useState } from 'react';
import axios from 'axios';
import RegCSS from './Register.module.css'
function Register() {
    const navigate = useNavigate();


    const [userName, setUserName] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAdress] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState<boolean>(false);



    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            let response = axios.post('http://localhost:3300/register', { userName, firstName, lastName, email, phone, address, password });
            console.log((await response).data);
            sessionStorage.setItem('isLoggedIn', JSON.stringify(true));
            getUserDetails(userName);
            navigate("/");
            window.location.reload();
        } catch (error) {
            console.error("Fehler beim registrieren");
            setError(true);
            console.log(error)
        }
    }


    async function getUserDetails(userName: string) {
        axios.get(`http://localhost:3300/userDetails/${userName}`).then(response => {
            sessionStorage.setItem('userDetails', JSON.stringify(response.data));

        });
    }



    return (
        <>
            <div className={RegCSS.register}>
    <div className={RegCSS.registerContainer}>
        <h2>Register</h2>

        <form className={RegCSS.form} onSubmit={handleRegister}>
            <div>
                <label htmlFor="userName">Username:</label>
            </div>
            <div>
                <input type="text" id="id" onChange={(e) => setUserName(e.target.value)} required />
            </div>

            <div>
                <label htmlFor="firstName">Vorname:</label>
            </div>
            <div>
                <input type="text" id="firstName" onChange={(e) => setFirstName(e.target.value)} required />
            </div>

            <div>
                <label htmlFor="lastName">Name:</label>
            </div>
            <div>
                <input type="text" id="lastName" onChange={(e) => setLastName(e.target.value)} required />
            </div>

            <div>
                <label htmlFor="email">Email:</label>
            </div>
            <div>
                <input type="text" id="email" onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
                <label htmlFor="phone">Telefonnummer:</label>
            </div>
            <div>
                <input type="text" id='phone' onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div>
                <label htmlFor="address">Adresse:</label>
            </div>
            <div>
                <input type="text" id="address" onChange={(e) => setAdress(e.target.value)} required />
            </div>

            <div>
                <label htmlFor="password">Password</label>
            </div>
            <div>
                <input type="text" id="password" onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div>
                <button type='submit'>Registrieren</button>
            </div>

            <div>
                <p>Haben sie schon ein Konto?</p>
                <Link to={'/login'}>Anmelden</Link>
            </div>
        </form>
        {error && (
            <p className="RegCSS.error-message">Ein Fehler ist aufgetreten! Versuche es erneut</p>
        )}
    </div>
</div>
        </>
    );
}

export default Register;