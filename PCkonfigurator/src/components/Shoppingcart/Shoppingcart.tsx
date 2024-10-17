import axios from 'axios';
import shopCss from './Shoppingcart.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function Shoppingcart() {

    const navigate = useNavigate();
    let sessionDetails = sessionStorage.getItem("userDetails");
    let userDetails: any;
    if (sessionDetails != null) { userDetails = JSON.parse(sessionDetails); }

    let sessionLogin = sessionStorage.getItem("isLoggedIn");
    let isLoggedIn: any;
    if (sessionLogin != null) { isLoggedIn = JSON.parse(sessionLogin); }

    let changableList: any[] = ["ram", "speicher", "os"];


    const [serverItems, setServerItems] = useState<any>([]);

    const [pcs, setPCs] = useState([]);
    const [items, setItems] = useState([]);
    const [ramList, setRamList] = useState<any>([]);
    const [speicherList, setSpeicherList] = useState<any>([]);
    const [osList, setOSList] = useState<any>([]);

    const [selectedPC, setSelectedPC] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selRam, setSelRam] = useState<any>(null);
    const [selSpeicher, setSelSpeicher] = useState<any>(null);
    const [selOS, setSelOS] = useState<any>(null);

    const [newPrice, setNewPrice] = useState<number>(0);
    const [oldRAMPrice, setOldRamPrice] = useState<number>(0);
    const [oldSpeicherPrice, setOldSpeicherPrice] = useState<number>(0);
    const [oldOSPrice, setOldOSPrice] = useState<number>(0);

    //price
    const [cartItems, setCartItems] = useState<any>([]);
    const [fullPrice, setFullPrice] = useState<number>(1);


    // Dicounts variables
    const [discountCode, setDiscountCode] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [couponMessageType, setCouponMessageType] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [originalPrice, setOriginalPrice] = useState<number>(0);

    const [discountSave, setDiscountSave] = useState<number>(0);

    const [missingItems, setMissingItems] = useState<any>();



    async function fetchCartItems() {
        if (isLoggedIn) {
            const userNr = userDetails.usernr;
            await axios.get(`http://localhost:3300/account/${userNr}`).then(response => {
                setServerItems(response.data);
                console.log(response.data);

                for (const element of response.data) {
                    if (element.itemsnr) {
                        setCartItems(response.data);
                        console.log(element);

                    }
                }
            });
        }
    }


    useEffect(() => {
        if (selectedPC) { // Überprüfen, ob selectedPC nicht null ist
            updatePrice();
        }
        fetchCartItems();
        completePrice();
        fetchItems();

    }, [selRam, selSpeicher, selOS, selectedPC, newPrice]);

    async function fetchItems() {
        if (isLoggedIn) {
            axios.get('http://localhost:3300/fertigpc').then(response => {
                setPCs(response.data);
            })
                .catch(error => {
                    console.error("Fehler beim laden der FertigPc's");
                })

            axios.get('http://localhost:3300/items').then(response => {
                setItems(response.data);

            })
                .catch(error => {
                    console.error("Fehler beim laden der Items");
                })
        }
    }

    function showModal(select: any): any {
        setSelectedPC(select);
        setIsModalOpen(true);
        console.log(ramList);
        setNewPrice(select.pcprice);

    }

    function closeModal(): void {
        setIsModalOpen(false);
        resetPrice();
    }

    function typeOf(type: any): any {
        const changable = document.querySelector(".itemList") as HTMLElement;
        for (const element of changableList) {
            const asd = document.querySelector(`.${element}`) as HTMLElement;
            if (element == type) {
                asd.classList.toggle("clicked");
                // console.log("DJDJD")
            }
        }
    }

    function resetPrice(): void {
        setSelRam(null);
        setSelSpeicher(null);
        setSelOS(null);
        setNewPrice(selectedPC.pcprice);
    }

    function clickedItem(item: any): any {
        if (item.typeof == 'RAM') {
            setSelRam(item);
        }
        if (item.typeof == 'SPEICHER') {
            setSelSpeicher(item);
        }
        if (item.typeof == 'BETRIEBSSYSTEM') {
            setSelOS(item);
        }
        updatePrice();
    }

    function updatePrice(): void {
        setNewPrice(selectedPC.pcprice);
        let p: number = newPrice;

        if (selRam != null) {
            for (const element of ramList) {
                if (element.name == selectedPC.nram) {
                    // p -= element.price; // Subtrahiere den Preis des aktuellen RAMs
                    // p += parseFloat(selRam.price); // Addiere den Preis des ausgewählten RAMs
                    // setNewPrice(p);
                    setNewPrice(prevPrice => prevPrice - element.price + parseFloat(selRam.price));
                }
            }
        }

        if (selSpeicher != null) {
            for (const element of speicherList) {
                if (element.name == selectedPC.nspeicher) {
                    setNewPrice(prevPrice => prevPrice - element.price + parseFloat(selSpeicher.price));
                }
            }
        }

        if (selOS != null) {
            for (const element of osList) {
                if (element.name == selectedPC.nos) {
                    setNewPrice(prevPrice => prevPrice - element.price + parseFloat(selOS.price));
                }
            }
        }
    }

    async function buyOrder() {
        const userNr = userDetails.usernr;
        try {
            if (serverItems.length > 0) {
                await axios.get(`http://localhost:3300/account/${userNr}`).then(response => {
                    console.log(response.data);
                    const userData = response.data;
                    let discountID: number = 0;

                    const donePCList = userData.filter((item: any) => item.itemsnr === null);
                    const itemsList = userData.filter((item: any) => item.pcid === null);


                    console.log(donePCList)
                    console.log("--------ss--")
                    console.log(itemsList)

                    console.log("DISCOUNT asdasd IS : " + discountSave);


                    if(discountSave !== null){
                        console.log("test");
                        discountID = discountSave;
                    }
 

                    console.log("DISCOUNT ID :" + discountID);

                    

                    for (const element of cartItems) {
                        if (element.itemsnr) {
                            // console.log("test");
                            checkAllItems(serverItems);
                        }
                    }

                    let responseOrder = axios.post('http://localhost:3300/orderedItems', { userNr, itemsList, donePCList, discountID });
                    // console.log(responseOrder);
                    // console.log("asdasd" + (response).data);
                    navigate("/account");
                });
                await axios.delete(`http://localhost:3300/account/${userNr}`).then(response => {

                });

                // window.location.reload();
            } else {
                console.log("Keine Items");
            }
        } catch (error) {

        }

    }

    async function updatePC() {
        if (selectedPC) {
            const userId = userDetails.usernr;
            let pcid = selectedPC.pcid;
            let shopcartid = selectedPC.shopcartid;
            let pcprice = newPrice;

            let ram = null;
            let speicher = null;
            let os = null;
            if (selRam !== null) {
                ram = selRam.name;
            }
            if (selSpeicher !== null) {
                speicher = selSpeicher.name;
            }
            if (selOS !== null) {
                os = selOS.name;
            }

            let response = axios.post('http://localhost:3300/account/changePcCart', { userId, pcid, shopcartid, pcprice, ram, speicher, os });
            if (response) {
                console.log("PC aktualisiert!");
                console.log(` ${typeof pcprice} + ${pcprice}`);
                console.log((await response).data);
            } else {
                console.log("Fehler beim ändern des PC's");
            }

            fetchCartItems();
        }
    }

    function clickedPC(item: any) {
        setSelectedPC(item);
        setIsModalOpen(true);
    }


    async function completePrice() {
        // let totalPrice: number = 0;
        const userNr = userDetails.usernr;
        await axios.get(`http://localhost:3300/account/getFullPrice/${userNr}`).then(response => {
            //     for (const item of response.data) {
            //         console.log(parseFloat(item.price))
            //         let price = parseFloat(item.price);
            //         totalPrice += price;
            //         setFullPrice(totalPrice);
            //     }
            setFullPrice(response.data.totalprice)
            console.log(typeof response.data);
            console.log(response.data.totalprice);
            setOriginalPrice(response.data.totalprice)// error is due to to null handling
        });
    }

    async function deletePCPart(pc: any) {
        console.log(typeof pc.shopcartid);
        const userNr = parseInt(userDetails.usernr);
        const shopcartid = parseInt(pc.shopcartid);
        axios.delete(`http://localhost:3300/account/shopcart/${userNr}/${shopcartid}`, {
        });
        setServerItems((prevItems:any) => prevItems.filter((item:any) => item.shopcartid !== pc.shopcartid));
        window.location.reload();
    }

    function navigateToConfig(): void {
        navigate("/konfigurator");
    }

    async function deleteCartItems() {
        const userNr = parseInt(userDetails.usernr);
        axios.delete(`http://localhost:3300/account/delShopCartItems/${userNr}`, {
        });
        location.reload();
    }
    // applyCoupon function doesnot updates the total now, given that there is no total
    const applyCoupon = async () => {
        if (couponApplied) {
            setCouponMessage("A coupon has already been applied to this order.");
            setCouponMessageType('error');

            setTimeout(() => {
                setCouponMessage('');
                setCouponMessageType('');
            }, 10000);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3300/discounts/${discountCode}`); // we get the value from the html down ${discountCode}
            console.log('Coupon response:', response.data); // visualization in consol for debugging
            const { discountpercent, newTotal } = response.data;
            if (discountpercent) {
                // logic to calculate the new total when there is a total function as in angular
                // Calculate the discounted price
                const discountDecimal = parseFloat(discountpercent) / 100;
                const discountedPrice = fullPrice * (1 - discountDecimal); // the error is due to the null handlingg
                setFullPrice(discountedPrice); // Update the fullPrice with the discounted price
                // console.log('The new total amount is:', newTotal); // just for feedback in the consol 
                setCouponMessage("Discount applied successfully!");
                setDiscountSave(discountCode);               
                setCouponMessageType('success');
                setDiscountSave(response.data.discountid);
                setDiscountCode('');
                setCouponApplied(true);
                setIsActive(false);
            } else {
                toggleClass();
                setCouponMessage(response.data.message || "Invalid coupon code");
                setCouponMessageType('error');
                setIsActive(false);
            }

            setTimeout(() => {
                setCouponMessage('');
                setCouponMessageType('');
                setIsActive(false);
            }, 10000);
        } catch (error: any) {
            toggleClass();
            console.error('Error applying coupon:', error);
            setCouponMessage(error.response?.data?.message || "An error occurred while applying the coupon.");
            setCouponMessageType('error');

            setTimeout(() => {
                setCouponMessage('');
                setCouponMessageType('');
                setIsActive(false);
            }, 10000);
        }
    };


    const [isActive, setIsActive] = useState(false);
    const toggleClass = () => {
        setIsActive(true); // Toggle the state
    };

    const errorActive = isActive ? 'activeError' : '';

    // END CODE FOR COUPON

    function checkAllItems(items: any[]): void {
        const requiredTypes = new Set([
            'CPU', 'GPU', 'RAM', 'MAINBOARD', 'SPEICHER', 'GEHAEUSE',
            'KUEHLER', 'NETZTEIL',
        ]);

        // Alle vorhandenen Typen in einem Set speichern
        const existingTypes = new Set(items.map(item => item.typeof));

        // Überprüfen, ob alle erforderlichen Typen im vorhandenen Set enthalten sind
        for (const type of requiredTypes) {
            if (!existingTypes.has(type)) {
                console.log(`Das Element mit dem Typ ${type} fehlt im Einkaufswagen.`);
                console.log('Der Kaufvorgang wird abgebrochen.');
                setMissingItems(true);
                throw new Error(`Das Element mit dem Typ ${type} fehlt im Einkaufswagen.`);
            }
        }

        // Alle erforderlichen Typen sind vorhanden, Kaufvorgang fortsetzen
        console.log('Alle erforderlichen Elemente sind im Einkaufswagen vorhanden. Der Kaufvorgang wird fortgesetzt.');
        // Weitere Aktionen ausführen...
    }

    useEffect(() => {

        function handleClickOutside(event: any) {
            const modal = document.querySelector('.modal');
            if (modal && !modal.contains(event.target)) {
                closeModal();
            }
        }

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            console.log(selectedPC.shopcartid);

        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        fetchItems();

        let filteredRamList: any = items.filter((item: { typeof: string }) => item.typeof === "RAM");
        let filteredSpeicherList = items.filter((item: { typeof: string }) => item.typeof === "SPEICHER");
        let filteredOSList = items.filter((item: { typeof: string }) => item.typeof === "BETRIEBSSYSTEM");
        setRamList(filteredRamList);
        setSpeicherList(filteredSpeicherList);
        setOSList(filteredOSList);
        console.log(filteredSpeicherList)
        // console.log(filteredRamList);

        filteredRamList.forEach((element: any) => {
            if (element.name == selectedPC.nram) {
                setOldRamPrice(element.price);
                console.log(element.price);
            }

        });

        filteredSpeicherList.forEach((element: any) => {
            if (element.name == selectedPC.nspeicher) {
                setOldSpeicherPrice(element.price);
                console.log(element.price);
            }
        });

        filteredOSList.forEach((element: any) => {
            if (element.name == selectedPC.nos) {
                setOldOSPrice(element.price);
                console.log(element.price);
            }
        });

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };


    }, [isModalOpen]);


    useEffect(() => {
        fetchCartItems();
        fetchItems();
        completePrice();
    }, []);

    return (
        <>
            <div className={shopCss.wrapper}>
                <div className={shopCss['bestell-container']}>
                    <h1>Deine Konfiguration...</h1>

                    <div className={shopCss.bestellung}>
                        {serverItems && serverItems.length >= 0 ? (
                            <div>
                                {serverItems.map((product: any) => (
                                    product.itemsnr ? (
                                        <div className={shopCss.componentContainer} key={product.itemsnr}>
                                            <h3>{product.name}</h3>
                                            <p>{product.price}€</p>
                                        </div>
                                    ) : (
                                        <div className={shopCss.componentContainer} key={product.pcid}>
                                            <h3>{product.namepc}</h3>
                                            <p>{product.price}€</p>
                                            <button onClick={() => clickedPC(product)}>Ändern</button>
                                            <button onClick={() => deletePCPart(product)}>entfernen</button>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : (
                            <h1>Du hast keine Items im Warenkorb</h1>
                        )}
                    </div>
                </div>

                <div className={shopCss.leftContainer}>
                    <div className={shopCss.editConfig} onClick={navigateToConfig}>Bearbeiten</div>
                    <div className={shopCss.editConfig} onClick={deleteCartItems}>Konfig entfernen</div>
                    <div className={shopCss['coupon-code-container']}>
                        <input
                            type="text"
                            id="couponCode"
                            className={shopCss.couponCode}
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Coupon eingeben"
                            name="couponCode"
                            required
                        />
                        <button onClick={applyCoupon}>Coupon einlösen</button>
                    </div>
                    <div className={`${shopCss['coupon-message']} ${shopCss[errorActive]}`}>
                        {couponMessage}
                    </div>

                    {/* Conditional rendering for displaying prices */}
                    {couponApplied && originalPrice !== fullPrice ? (
                        <div className={shopCss.priceTag}>
                            <div className={shopCss.priceTag} style={{ textDecoration: 'line-through' }}>ORIGINALPREIS:{originalPrice} €</div>
                            <div className={shopCss.priceTag}>PREIS: {fullPrice} €</div>
                        </div>
                    ) : (
                        <div className={shopCss.priceTag}>PREIS: {fullPrice} €</div>
                    )}
                    {missingItems && (
                        <h3 className={shopCss.missing}>Deine Konfiguration ist unvollständig! <br /> Klicke oben auf "Bearbeiten"</h3>
                    )}
                    <div className={shopCss.abschliessen} onClick={buyOrder}>Kaufen</div>
                </div>
            </div>


            {isModalOpen && (
                <div className="modal-container">
                    <div className="modal">
                        <div className="flex-container">
                            <img className="imageBig" src={`http://localhost:3300/fertigpc/${selectedPC?.image}`} alt="" />
                            <div className="infoText">
                                <div className="scrollable">
                                    <h1>{selectedPC?.namepc}</h1>
                                    <h2>Prozessor: {selectedPC?.ncpu}</h2>
                                    <h2>Grafikkarte: {selectedPC?.ngpu}</h2>

                                    {/* RAM */}
                                    <div className="changable" onClick={() => typeOf('ram')}>
                                        {selRam ? (
                                            <h2>Ram: {selRam.name} +  {selRam.price}€</h2>
                                        ) : (
                                            <h2>Ram: {selectedPC.nram} + {oldRAMPrice}€</h2>
                                        )}
                                    </div>
                                    <div className="itemList ram" id='ram'>
                                        {ramList.map((ram: any) => (
                                            <h2 key={ram.itemsnr} onClick={() => clickedItem(ram)}>{ram.name} + {ram.price}€</h2>
                                        ))}
                                    </div>

                                    {/* SPEICHER */}
                                    <div className="changable" onClick={() => typeOf('speicher')}>
                                        {selSpeicher ? (
                                            <h2>Speicher: {selSpeicher.name} +  {selSpeicher.price}€</h2>
                                        ) : (
                                            <h2>Speicher: {selectedPC.nspeicher} + {oldSpeicherPrice}€</h2>
                                        )}
                                    </div>
                                    <div className="itemList speicher" id='speicher'>
                                        {speicherList.map((speicher: any) => (
                                            <h2 key={speicher.itemsnr} onClick={() => clickedItem(speicher)}>{speicher.name} + {speicher.price}€</h2>
                                        ))}
                                    </div>
                                    navigateToConfig
                                    {/* BETRIEBSSYSTEM  */}
                                    <div className="changable" onClick={() => typeOf('os')}>
                                        {selOS ? (
                                            <h2>Betriebssystem: {selOS.name} +  {selOS.price}€</h2>
                                        ) : (
                                            <h2>Betriebssystem: {selectedPC.nos} + {oldOSPrice}€</h2>
                                        )}
                                    </div>
                                    <div className="itemList os" id='os'>
                                        {osList.map((os: any) => (
                                            <h2 key={os.itemsnr} onClick={() => clickedItem(os)}>{os.name} + {os.price}€</h2>
                                        ))}
                                    </div>

                                    <div>
                                        {newPrice ? (
                                            <h1>Preis: {newPrice}€</h1>
                                        ) : (
                                            <h1>Preis: {selectedPC.pcprice}</h1>
                                        )}
                                    </div>

                                    <div className="buyButton" onClick={updatePC}>KAUFEN</div>

                                </div>
                                <span className="close" onClick={closeModal}>X</span>

                            </div>
                        </div>
                    </div>
                </div >
            )
            }
        </>
    );
}

export default Shoppingcart;
