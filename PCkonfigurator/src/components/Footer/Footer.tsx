import footerCSS from './Footer.module.css'

function Footer() {
    return (
        <>
            <footer>
                <div className={footerCSS.textSection}>
                    <p>Entwickelt von Jehee Han, Daniel Möller, Kevin Tazanou</p>
                    <p>&copy Copyright 2024. All rights reserved</p>
                </div>
            </footer>
        </>
    );
}

export default Footer;