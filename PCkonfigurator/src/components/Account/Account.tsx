import { useEffect, useState } from 'react';
import AccountCSS from './Account.module.css'
import axios from "axios";
function Account() {

    useEffect(() => {
        fetchItems();
        getHistory();
    }, [])

    function fetchItems(): void {
        getHistory();
    }

    const userDetailsString = sessionStorage.getItem('userDetails');
    let details: any;
    let accBestellHistory: any
    // const [bestellDetails, setBestellDetails] = useState([]);
    const [orderNrDivs, setOrderNrDivs] = useState([]); // Zustand für die Bestellnummer-Divs

    // let bestellDetails: any;


    if (userDetailsString !== null) {
        details = JSON.parse(userDetailsString);
    }


    function calculateTotalPrice(orderDetails: any) {
        return orderDetails.reduce((total: any, detail: any) => {

            // console.log("detail: " + detail);

            const priceItem = parseFloat(detail.price) || 0; // Konvertiere den Preis in eine Zahl oder setze ihn auf 0, wenn er nicht vorhanden ist
            const pricePC = parseFloat(detail.pcprice) || 0;
            // console.log(pricePC)
            return total + priceItem + pricePC;
        }, 0);
    }

    function getHistory(): void {
        const userDetailsString = sessionStorage.getItem('userDetails');
        let accDetails: any;
        // ich musste [] aber weis net warum edit: nvm weis ich doch
        let bestellDetails: any[];


        if (userDetailsString !== null) {
            accDetails = JSON.parse(userDetailsString);
            // die Bestellungen des eingeloggten User werden rausgesucht
            axios.get('http://localhost:3300/ordered/' + accDetails.usernr).then(response => {
                accBestellHistory = response.data;

                //Bestellungen werden zur lesbaren string json umgewandelt
                if (accBestellHistory !== null) {
                    bestellDetails = JSON.parse(JSON.stringify(accBestellHistory));

                    let uniqueOrderNr: any;

                    //Hier werden die jeweiligen Bestellnr Rausgeschrieben:
                    const orderNr = bestellDetails.map(detail => detail.bestellungnr);
                    uniqueOrderNr = [...new Set(orderNr)];
                    // console.log(bestellDetails.filter(detail => detail.bestellungnr === 29));
                    const ordersWithTotalPrice = uniqueOrderNr.map((orderNr : any) => ({
                        orderNr,
                        date: bestellDetails
                            .filter(detail => detail.bestellungnr === orderNr)
                            .map(detail => detail.orderdate)[0].slice(0, 10),
                        matchingDetails: bestellDetails.filter(detail => detail.bestellungnr === orderNr),
                        discount: bestellDetails
                            .filter(detail => detail.bestellungnr === orderNr)
                            .map(detail => detail.discountid)[0],
                        discountNumber: bestellDetails
                            .filter(detail => detail.bestellungnr === orderNr)
                            .map(detail => detail.discountpercent)[0],
                        totalPrice: calculateTotalPrice(bestellDetails.filter(detail => detail.bestellungnr === orderNr)).toFixed(2),
                    }));
                    setOrderNrDivs(ordersWithTotalPrice);
                    // setOrderNrDivs(uniqueOrderNr.map(orderNr => ({ orderNr, matchingDetails: bestellDetails.filter(detail => detail.bestellungnr === orderNr)
                    // })));
                    // setOrderNrDivs(orderNrDivs); // hier wird ein fehelr angezeigt aber einfach ignorieren außer ihr wisst wraum
                }
            })
        }
    }



    return (
        <>
            <div className={AccountCSS['account-container']}>
                <div className={AccountCSS['account-box']}>
                    <h3>Benutzerdaten </h3>
                    <p>Benutzername: {details?.username}</p>
                    <p>Vorname: {details?.firstname}</p>

                    <h3>Deine Bestellhistory:</h3>
                    <div className={AccountCSS.oderdhistory}>
                        {orderNrDivs.map(({ orderNr, date, matchingDetails, discount, discountNumber, totalPrice }, index) => (
                            <div key={index} className={AccountCSS.orderBox}>
                                <div className={AccountCSS.showOrderInfo}>
                                    <h3>Bestellnummer: {orderNr}</h3>
                                    <h3>Datum: {date}</h3>
                                    {discount !== null ? (
                                        <>
                                            <div>
                                                <s>Originalpreis: {totalPrice} € </s> 
                                                <h3>{discountNumber}% Rabatt </h3>
                                                <h3>Gesamtpreis: {totalPrice * (1 - (discountNumber / 100))}</h3>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <h3>Gesamtpreis: {totalPrice} €</h3>
                                        </>
                                    )}


                                </div>
                                {matchingDetails.map((detail: any, innerIndex: any) => (
                                    <div key={innerIndex} className={AccountCSS.compText}>
                                        {detail.itemsnr !== null ? (
                                            <>
                                                <div className={AccountCSS.itemInfo}>
                                                    <p>Name: {detail.name}</p>
                                                    <p>Preis: {detail.price}€</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={AccountCSS.pcInfo}>
                                                    <div className={AccountCSS.itemInfo}>
                                                        <p>Name: {detail.namepc}</p>
                                                        <p>Preis: {detail.pcprice}€</p>
                                                    </div>

                                                    {detail.ram !== null ? (
                                                        <>
                                                            <div className={AccountCSS.itemInfo}>
                                                                <p>Veränderte Ram: {detail.ram}</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}

                                                    {detail.speicher !== null ? (
                                                        <>
                                                            <div className={AccountCSS.itemInfo}>
                                                                <p>Veränderte Speicher: {detail.speicher}</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}


                                                    {detail.os !== null ? (
                                                        <>
                                                            <div className={AccountCSS.itemInfo}>
                                                                <p>Veränderte OS: {detail.os}</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                        </>
                                                    )}

                                                </div>
                                            </>
                                        )}
                                    </div>
                                    //

                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Account;