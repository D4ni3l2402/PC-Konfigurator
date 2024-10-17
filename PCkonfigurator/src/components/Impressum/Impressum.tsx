import ImprintCSS from './Impressum.module.css'

function Impressum() {
    return (
        <>

                <div className={ImprintCSS['imp-container']}>
                    <h1>Impressum</h1>
                    <div className={ImprintCSS.thmTag}>
                        <p>Technische Hochschule Mittelhessen (THM)</p>
                        <p>Impressum der THM</p>
                    </div>

                    <div className={ImprintCSS.textMembers}>
                        <p>Website erstellt von:</p>
                        <p>Daniel Moeller, Jehee Han, Kevin Tazanou</p>
                    </div>
                </div>

        </>
    );
}

export default Impressum;