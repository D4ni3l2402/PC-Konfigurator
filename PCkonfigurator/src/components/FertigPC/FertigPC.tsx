import { useEffect, useState } from 'react';
import './FertigPC.css'
import axios from 'axios';
import {useNavigate } from "react-router-dom";

function FertigPC() {

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
    const navigate = useNavigate();

    function navigateToCart(): void {
        navigate("/cart")
    }


    let changableList: any[] = ["ram", "speicher", "os"];

    let sessionDetails = sessionStorage.getItem("userDetails");
    let userDetails: any;
    if (sessionDetails != null) { userDetails = JSON.parse(sessionDetails); }

    function fetchItems() {
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

    useEffect(() => {
        fetchItems();
        let filteredRamList: any = items.filter((item: { typeof: string }) => item.typeof === "RAM");
        let filteredSpeicherList = items.filter((item: { typeof: string }) => item.typeof === "SPEICHER");
        let filteredOSList = items.filter((item: { typeof: string }) => item.typeof === "BETRIEBSSYSTEM");
        setRamList(filteredRamList);
        setSpeicherList(filteredSpeicherList);
        setOSList(filteredOSList);
        // console.log(filteredSpeicherList)
        // console.log(filteredRamList);

        filteredRamList.forEach((element: any) => {
            if (element.name == selectedPC.nram) {
                setOldRamPrice(element.price);
                // console.log(element.price);
            }
        });

        filteredSpeicherList.forEach((element: any) => {
            if (element.name == selectedPC.nspeicher) {
                setOldSpeicherPrice(element.price);
                // console.log(element.price);
            }
        });

        filteredOSList.forEach((element: any) => {
            if (element.name == selectedPC.nos) {
                setOldOSPrice(element.price);
                // console.log(element.price);
            }
        });
    }, [isModalOpen]);

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

    useEffect(() => {
        if (selectedPC) { // Überprüfen, ob selectedPC nicht null ist
            updatePrice();
        }
    }, [selRam, selSpeicher, selOS, selectedPC]);

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

    async function addToCart(){
        if(selectedPC){
            const userId = userDetails.usernr;
            // console.log(selRam.itemsnr);
            let pcid = selectedPC.pcid;
            let ram = null ;
            let speicher = null;
            let os = null;

            if(selRam !==null){
                ram = selRam.name;
            }
            if(selSpeicher !==null){
               speicher  = selSpeicher.name;
            }
            if(selOS !==null){
                os = selOS.name;
            }
            let pcprice  = newPrice;
            let response = axios.post('http://localhost:3300/account', {userId, cartItem:null, pcid, pcprice, ram, speicher, os});
            console.log(` ${typeof pcprice} + ${pcprice}`);
            if(response != null){
                console.log("PC hinzugefügt.");
                console.log((await response).data);
                
            } else {
                console.log("Fehler beim adden des PC's");
            }

            navigateToCart();
        }
    }

    function showModal(select: any): any {
        setSelectedPC(select);
        setIsModalOpen(true);
        // console.log(ramList);
        setNewPrice(select.pcprice);

    }

    function closeModal(): void {
        setIsModalOpen(false);
        resetPrice();
    }

    return (
        <>
            <div className="doneContainer">
                {pcs.map((product: any) => (
                    <div className="donePC" key={product.pcid} onClick={() => showModal(product)}>
                        <div className="showPic"><img src={`http://localhost:3300/fertigpc/${product.image}`} alt="Bild PC" /></div>
                        <div className="titelPreis">
                            <h1 className="titelPreisName">{product.namepc}</h1>
                            <h2 className="titelPreisText">{product.pcprice}€</h2>

                        </div>
                    </div>
                ))}
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
                                </div>
                                <div>
                                        {newPrice ? (
                                            <h1>Preis: {newPrice}€</h1>
                                        ) : (
                                            <h1>Preis: {selectedPC.pcprice}</h1>
                                        )}
                                    </div>

                                <div className="buyButton" onClick={addToCart}>KAUFEN</div>
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

export default FertigPC;