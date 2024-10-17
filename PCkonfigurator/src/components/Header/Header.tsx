import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect} from 'react';
import './Header.css'
import axios from 'axios';
import CartImg from '../../assets/shopping-cart-128.png'

function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    // const [clicked, setClicked] = useState<any | null>(null);


    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    useEffect(() => {
        function handleClickOutside(event: any) {
            const modal = document.querySelector('.modal');
            if (modal && !modal.contains(event.target)) {
                closeModal();
            }
        }

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    useEffect(() => {
        fetchItems();
    }, [])

    

    function openSidebar(): void {
        let menu = document.querySelector(".sidebar") as HTMLElement;
        menu.classList.toggle("open");
        hamClick();
        console.log(isLoggedIn);

    }

    function hamClick(): void {
        let iconI = document.querySelector(".iconPartI") as HTMLElement;
        let iconII = document.querySelector(".iconPartII") as HTMLElement;
        let iconIII = document.querySelector(".iconPartIII") as HTMLElement;
        iconI.classList.toggle("active");
        iconII.classList.toggle("active");
        iconIII.classList.toggle("active");
        console.log(details);

    }

    function loggout(): void {
        navigate("/");
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userDetails');
        window.location.reload();
    }

    function navigateToCart(): void {
        navigate("/cart")
    }

    function navigateToAccount(): void {
        navigate("/account");
    }

    function navigateToLogin(): void {
        navigate("/login");
    }


    function navigateToRegister(): void {
        navigate("/register");
    }

    const userDetailsString = sessionStorage.getItem('userDetails');
    let details: any;

    if (userDetailsString !== null) {
        details = JSON.parse(userDetailsString);
    }

    // asdasdasd
    function fetchItems(): void {
        axios.get('http://localhost:3300/items').then(response => {
            setProducts(response.data);
        })
            .catch(error => {
                console.error("Fehler beim laden der Items: ", error);

            })
    }

    function showModal(category: string): void {
        setIsModalOpen(true);
        const filtered = products.filter((item: { typeof: string }) => item.typeof === category);
        let filteredBrand: any = [];



        if (filteredBrand.length > 0) {
            console.log(filteredBrand);
            setFilterProducts(filteredBrand);
            // setClicked(() => filteredBrand[0]);

        } else {
            console.log(filtered);
            setFilterProducts(filtered);
            // setClicked(() => filtered[0]);
        }


    }

    function closeModal(): void {
        setIsModalOpen(false);
    }

    return (
        <>
            <header>
                <nav>
                    <h1 className="logo">ConfigNow</h1>
                    {/* <!-- <img src="../../assets/ConfigNow_logo.png" class="classIcon"> --> */}
                    <ul className="clickNavTop">
                        <li ><Link className={location.pathname === '/' ? 'active nav-link' : 'nav-link'} to={'/'} >Startseite</Link></li>
                        <li ><Link className={location.pathname.startsWith('/konfigurator') ? 'active nav-link' : 'nav-link'} to={'/konfigurator/cpu'} >Konfigurator</Link></li>
                        <li ><Link className={location.pathname === '/fertigpc' ? 'active nav-link' : 'nav-link'} to={'/fertigpc'} >Fertige PC's</Link></li>
                        <li ><Link className={location.pathname === '/impressum' ? 'active nav-link' : 'nav-link'} to={'/impressum'} >Impressum</Link></li>

                        {/* <li className={location.pathname === '/fertigpc' ? 'active' : ''}><Link to={'/fertigpc'} className="nav-link">Fertige PC's</Link></li>
                        <li className={location.pathname === '/impressum' ? 'active' : ''}><Link to={'/impressum'} className="nav-link">Impressum</Link></li> */}

                    </ul>
                    <div className="options">
                        <img src={CartImg} alt="Einkaufswagen" className="cart" onClick={navigateToCart} />
                        <div className="hamburgerMenu nav-icon" onClick={openSidebar}>
                            <div className="line iconPartI"></div>
                            <div className="line iconPartII"></div>
                            <div className="line iconPartIII"></div>
                        </div>
                    </div>
                </nav>
            </header >

            <div className="sidebar">
                <div className="sidebar-container">
                    {isLoggedIn ? (
                        <div className="welcome-msg">
                            <h3>Willkommen, {details?.username}</h3>
                            <button className="accountBtn" onClick={navigateToAccount}>Mein Account</button>
                            <div className="logout" onClick={loggout}>Abmelden</div>
                        </div>
                    ) : (
                        <div className="logReg-container">
                            <div className="login-prompt">
                                <button className="login-btn" onClick={navigateToLogin}>Anmelden</button>
                                <button className="register-btn" onClick={navigateToRegister}>Registrieren</button>
                            </div>
                        </div>
                    )}

                    <div className="dash" id="dashNav"></div>

                    <div className="sideNavlink">
                        <Link className={location.pathname === '/' ? 'active nav-link' : 'nav-link'} to={'/'} >Startseite</Link>
                        <Link className={location.pathname === '/konfigurator' ? 'active nav-link' : 'nav-link'} to={'/konfigurator/cpu'} >Konfigurator</Link>
                        <Link className={location.pathname === '/fertigpc' ? 'active nav-link' : 'nav-link'} to={'/fertigpc'} >Fertige PC's</Link>
                        <Link className={location.pathname === '/impressum' ? 'active nav-link' : 'nav-link'} to={'/impressum'} >Impressum</Link>
                    </div>
                    <div className="dash"></div>

                    <div className="v">Verfügbarkeit</div>
                    <ul className="available-list">
                        <div className="available-link"  onClick={() => showModal('CPU')}>cpu</div>
                        <div className="available-link"  onClick={() => showModal('GPU')}>gpu</div>
                        <div className="available-link"  onClick={() => showModal('RAM')}>ram</div>
                        <div className="available-link"  onClick={() => showModal('SPEICHER')}>speicher</div>
                        <div className="available-link"  onClick={() => showModal('GEHAEUSE')}>gehäuse</div>
                        <div className="available-link" onClick={() => showModal('MAINBOARD')}>mainboard</div>
                        <div className="available-link" onClick={() => showModal('KUEHLER')}>kuehler</div>
                        <div className="available-link" onClick={() => showModal('NETZTEIL')}>netzteil</div>
                        <div className="available-link" onClick={() => showModal('LAUFWERK')}>laufwerk</div>
                        <div className="available-link" onClick={() => showModal('BETRIEBSSYSTEM')}>betriebssystem</div>
                    </ul>
                </div>
            </div>

            {isModalOpen && (
            <div className="modal-container">
                <div className="modal">
                    <div className="flex-container">
                        <div className="item-container">
                        {filterProducts.map((product: any) => (
                                    <div className={"item1"} key={product.id} >
                                        <h1>{product.name}</h1>
                                        <p>Preis: {product.price} €</p>
                                        <p>Preis: {product.description}</p>
                                        <p>Preis: {product.quantity}</p>
                                    </div>
                                ))}                        
                        </div>
                        <span className="close" onClick={closeModal}>X</span>
                        
                    </div> 
                </div>
            </div >
                        )}
        </>



    );
}

export default Header;