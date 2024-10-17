import { useState, useEffect, useContext, } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import KonfigCSS from './Konfigurator.module.css';
import './Konfigurator.module.css';
import { BrandContext } from '../../context/BrandContext';



function Konfigurator() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    const [clicked, setClicked] = useState<any | null>(null);
    const [serverItems, setServerItems] = useState<any>([]);

    const [cpu, setCPU] = useState<any>();
    const [gpu, setGPU] = useState<any>();
    const [ram, setRam] = useState<any>();
    const [speicher, setSpeicher] = useState<any>();
    const [gehaeuse, setGehaeuse] = useState<any>();
    const [mainboard, setMainboard] = useState<any>();
    const [kuehler, setKuehler] = useState<any>();
    const [netzteil, setNetzteil] = useState<any>();
    const [laufwerk, setLaufwerk] = useState<any>();
    const [betriebssystem, setBetriebssystem] = useState<any>();

    const brandContext = useContext(BrandContext);
    const selectBrandCPU = brandContext?.selectBrandCPU;
    const selectBrandGPU = brandContext?.selectBrandGPU;
    const navigate = useNavigate();

    let sessionDetails = sessionStorage.getItem("userDetails");
    let userDetails: any;
    if (sessionDetails != null) { userDetails = JSON.parse(sessionDetails); }

    const isLoggedInString = sessionStorage.getItem('isLoggedIn');
    let isLoggedIn: any;

    if (isLoggedInString != null) { isLoggedIn = JSON.parse(isLoggedInString); }

    useEffect(() => {
        function handleClickOutside(event: any) {
            const modal = document.querySelector(`.${KonfigCSS.modal}`) as HTMLElement;
            if (modal && !modal.contains(event.target)) {

                closeModal();

            }
        }

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // getCartItems();


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isModalOpen]);

    useEffect(() => {
        fetchItems();
        getCartItems();
        showCartItems()
    }, [])

    useEffect(() => {
        showCartItems();
    }, [serverItems]);

    useEffect(() => {
        if (serverItems.length > 0) {

        }
    }, [serverItems]);

    // useEffect(() => {
    //     console.log(clicked);
    // }, [clicked]);

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

        if (category == "CPU") {
            filteredBrand = filtered.filter((item: { name: string }) => item.name.toLowerCase().includes(selectBrandCPU.toLowerCase()));
        } else if (category == "GPU") {
            filteredBrand = filtered.filter((item: { name: string }) => item.name.toLowerCase().includes(selectBrandGPU.toLowerCase()));
        }

        if (filteredBrand.length > 0) {
            console.log(filteredBrand);
            setFilterProducts(filteredBrand);
            setClicked(() => filteredBrand[0]);

        } else {
            console.log(filtered);
            setFilterProducts(filtered);
            setClicked(() => filtered[0]);
        }
    }

    function closeModal(): void {
        setIsModalOpen(false);
    }

    function clickedItem(item: any) {
        if (item !== null) {
            setClicked(item);
        }
    }

    async function getCartItems() {
        if (isLoggedIn) {
            const userNr = userDetails.usernr;
            axios.get(`http://localhost:3300/account/${userNr}`).then(response => {
                setServerItems(response.data);
                console.log(response.data);
            });
        }
    }

    function showCartItems() {
        for (const element of serverItems) {
            const typeOf = element.typeof;
            // let box = document.querySelector(`.${typeOf.toLowerCase()}`) as HTMLHtmlElement;

            if (typeOf == 'CPU') {
                setCPU(element);
                // box.style.backgroundColor = "green";
            }
            if (typeOf == 'GPU') {
                setGPU(element);
                // box.style.backgroundColor = "green";
            }
            if (typeOf == "RAM") {
                setRam(element);
                // box.style.backgroundColor = "green";
            }
            if (typeOf == "MAINBOARD") {
                setMainboard(element);
                // box.style.backgroundColor = "green";
            }
            if (typeOf == "SPEICHER") {
                setSpeicher(element);
                // box.style.backgroundColor = "green";
            }
            if (typeOf == "GEHAEUSE") {
                setGehaeuse(element);
                // box.style.backgroundColor = "green";
            }
            if (typeOf == "KUEHLER") {
                setKuehler(element);
                // box.style.backgroundColor = "green";
            }
            if (typeOf == "NETZTEIL") {
                setNetzteil(element);
                // box.style.backgroundColor = "green";
            }
            if (typeOf == "LAUFWERK") {
                setLaufwerk(element);
                // box.style.backgroundColor = "green";
            }
            if (typeOf == "BETRIEBSSYSTEM") {
                setBetriebssystem(element);
                // box.style.backgroundColor = "green";
            }
        }
    }

    async function addToCart() {
        if (clicked) {
            if (isLoggedIn) {
                const userId = userDetails.usernr;
                let cartItem = clicked.itemsnr;
                let pcprice = clicked.price
                for (const element of serverItems) {
                    if (clicked.itemsnr == element.itemsnr) {
                        console.log("Du hast das Item bereits im Warenkorb");
                        return;
                    }

                    if (clicked.typeof == element.typeof) {
                        console.log(`Du hast bereits den Typ ${cartItem.typeof}!`);
                        updateCartItem();
                        closeModal();
                        return;
                    }
                }

                if (clicked.quantity > 0) {
                    let response = axios.post('http://localhost:3300/account', { userId, cartItem, pcid: null, pcprice });
                    if (response) {
                        console.log("Item hinzugefügt!");

                        console.log((await response).data);
                    } else {
                        console.log("Fehler beim adden des Items");
                    }
                    closeModal();
                    getCartItems();
                } else {
                    console.log(`${clicked.name} nicht verfügbar`);

                }
            } else {
                navigate("/login");
            }
        }
    }


    async function updateCartItem() {
        if (clicked) {
            const userId = userDetails.usernr;
            let cartItem = clicked.itemsnr;
            let typeOf = clicked.typeof;
            let pcprice = clicked.price;

            let response = await axios.post('http://localhost:3300/account/changeCart', { userId, cartItem, typeOf, pcprice });
            if (response) {
                console.log("item aktualisiert");

            } else {
                console.log("Fehler beim aktualisieren!");

            }
            getCartItems();
        }
    }

    function navigateToCart(): void {
        navigate("/cart")
    }

    return (
        <>
            <div className={KonfigCSS.wrapper}>

                <div className={KonfigCSS.selecContainer}>

                    <div className={KonfigCSS.clickBox} onClick={() => showModal('CPU')}>
                        <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/Chip.Svg" alt="" />
                    </div>
                    <div className={KonfigCSS.titleBox}>
                        <h3>cpu</h3>
                        {cpu && (
                            <h4 className={KonfigCSS.showSel}>{cpu.name}</h4>
                        )}
                    </div>

                </div>
                <div className={KonfigCSS.selecContainer} onClick={() => showModal('GPU')}>

                    <div className={KonfigCSS.clickBox} >
                        <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/GPU.Svg" alt="" />
                    </div>
                    <div className={KonfigCSS.titleBox}>
                        <h3>gpu</h3>
                        {gpu && (
                            <h4 className={KonfigCSS.showSel}>{gpu.name}</h4>
                        )}
                    </div>

                </div>
                <div className={KonfigCSS.selecContainer} onClick={() => showModal('RAM')}>
                        <div className={KonfigCSS.clickBox}>
                            <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/Ram.Svg" alt="" />
                        </div>
                        <div className={KonfigCSS.titleBox}>
                            <h3>ram</h3>
                            {ram && (
                                <h4 className={KonfigCSS.showSel}>{ram.name}</h4>
                            )}
                        </div>
                </div>
                <div className={KonfigCSS.selecContainer} onClick={() => showModal('SPEICHER')}>

                        <div className={KonfigCSS.clickBox}>
                            <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/Harddisk.Svg" alt="" />
                        </div>
                        <div className={KonfigCSS.titleBox}>
                            <h3>speicher</h3>
                            {speicher && (
                                <h4 className={KonfigCSS.showSel}>{speicher.name}</h4>
                            )}
                        </div>

                </div>
                <div className={KonfigCSS.selecContainer} onClick={() => showModal('GEHAEUSE')}>

                        <div className={KonfigCSS.clickBox}>
                            <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/PC.Svg" alt="" />
                        </div>
                        <div className={KonfigCSS.titleBox}>
                            <h3>gehäuse</h3>
                            {gehaeuse && (
                                <h4 className={KonfigCSS.showSel}>{gehaeuse.name}</h4>
                            )}
                        </div>

                </div>
                <div className={KonfigCSS.selecContainer} onClick={() => showModal('MAINBOARD')}>

                        <div className={KonfigCSS.clickBox} >
                            <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/motherboard.Svg" alt="" />
                        </div>
                        <div className={KonfigCSS.titleBox}>
                            <h3>mainboard</h3>
                            {mainboard && (
                                <h4 className={KonfigCSS.showSel}>{mainboard.name}</h4>
                            )}
                        </div>

                </div>
                <div className={KonfigCSS.selecContainer} onClick={() => showModal('KUEHLER')}>

                        <div className={KonfigCSS.clickBox}>
                            <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/Processorfan.Svg" alt="" />
                        </div>
                        <div className={KonfigCSS.titleBox}>
                            <h3>kühler</h3>
                            {kuehler && (
                                <h4 className={KonfigCSS.showSel}>{kuehler.name}</h4>
                            )}
                        </div>

                </div>
                <div className={KonfigCSS.selecContainer} onClick={() => showModal('NETZTEIL')}>
  
                        <div className={KonfigCSS.clickBox}>
                            <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/PowerSupply.Svg" alt="" />
                        </div>
                        <div className={KonfigCSS.titleBox}>
                            <h3>netzteil</h3>
                            {netzteil && (
                                <h4 className={KonfigCSS.showSel}>{netzteil.name}</h4>
                            )}
                        </div>

                </div>
                <div className={KonfigCSS.selecContainer} onClick={() => showModal('LAUFWERK')}>

                        <div className={KonfigCSS.clickBox}>
                            <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/DVDdrive.Svg" alt="" />
                        </div>
                        <div className={KonfigCSS.titleBox}>
                            <h3>laufwerk</h3>
                            {laufwerk && (
                                <h4 className={KonfigCSS.showSel}>{laufwerk.name}</h4>
                            )}
                        </div>

                </div>
                <div className={KonfigCSS.selecContainer} onClick={() => showModal('BETRIEBSSYSTEM')}>
                        <div className={KonfigCSS.clickBox}>
                            <img className={KonfigCSS.selecPic} src="http://localhost:3300/selecPic/Disk.Svg" alt="" />
                        </div>
                        <div className={KonfigCSS.titleBox}>
                            <h3>betriebssystem</h3>
                            {betriebssystem && (
                                <h4 className={KonfigCSS.showSel}>{betriebssystem.name}</h4>
                            )}
                        </div>
              
                </div>
            </div>

            <div className={KonfigCSS['warenkorb-container']}>
                <div className={KonfigCSS['warenkorb-button']} onClick={navigateToCart}>Zum Warenkorb</div>
            </div>

            {isModalOpen && filterProducts && (
                <div className={KonfigCSS['modal-container']}>
                    <div className={KonfigCSS.modal}>
                        <div className={KonfigCSS['flex-container']}>
                            <div className={KonfigCSS['item-container']}>
                                {filterProducts.map((product: any) => (
                                    <div className={KonfigCSS['item1']} key={product.id} onClick={() => clickedItem(product)}>
                                        <img src={`http://localhost:3300/${product.typeof}/${product.image}`} alt="" className={KonfigCSS.itemimage} />
                                        <h1>{product.name}</h1>
                                        <p>Preis: {product.price} €</p>
                                    </div>
                                ))}
                            </div>
                            <div className={KonfigCSS['auswahlcontainer']}>
                                <div className={KonfigCSS['auswahl']}>
                                    <h1>{clicked?.name}</h1>
                                    <p><b>Preis:</b> {clicked?.price} €</p>
                                    <p><b>Anzahl:</b> {clicked?.quantity}</p>
                                    <p><b>Power:</b> {clicked?.power}</p>
                                    <p><b>Beschreibung:</b> {clicked?.description}</p>
                                    {/* <p className="error-item">Das Item existiert bereits</p> */}
                                </div>
                                <button onClick={addToCart} className={KonfigCSS.addToCart}>Hinzufügen</button>
                            </div>
                            <span className={KonfigCSS.close} onClick={closeModal}>X</span>
                        </div>
                    </div>
                </div>
            )}
        </>


    );
}

export default Konfigurator;
