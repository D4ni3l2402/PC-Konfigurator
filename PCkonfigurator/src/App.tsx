import appCSS from './App.module.css'
import konfigurierenPic from '../src/assets/konfigurieren.jpg'
import gamingPic from '../src/assets/gaming-computer.jpg'
import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';

function App() {
  // const [count, setCount] = useState(0)

  useEffect(() => {
    fetch('http://localhost:3300/trends')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []); // The empty array ensures this effect runs only once after the initial render
  // State to store the fetched data to later loop through it
  const [data, setData] = useState([]);


  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    '../src/assets/intel.png',
    '../src/assets/image4.jpg',
    '../src/assets/amd 1.png',
    '../src/assets/gaming-computer.jpg'
  ];

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={appCSS.content}>
        <div className={appCSS['sliderContainer']}>
          <img src={images[currentIndex]} alt="Bild1" className={appCSS['imgSlider']} />


          <div className={appCSS['sliderDots']}>
            {images.map((_, index) => (
              <div key={index} className={`${appCSS.dot} ${currentIndex === index && appCSS.activeDot}`}></div>
            ))}
          </div>
          <div className={appCSS.prev} onClick={prevSlide}>&lt;</div>
          <div className={appCSS.next} onClick={nextSlide}>&gt;</div>
        </div>

        <div className={appCSS['flexContainer']}>
          <div className={appCSS['pcConfig']}>
            <h1 className={appCSS.headline}>PC selber konfigurieren</h1>
            <p>Baue dir hier deinen Traum PC zusammen</p>
            <p>Unser PC-Konfigurator ermöglicht es dir, die neuesten Komponenten nach deinem Geschmack auszuwählen</p>
            <p>Ob Gaming, Arbeit oder Multimedia - gestalte deinen PC perfekt nach deinen Bedürfnissen</p>
            <p>Schluss mit Kompromissen – hier bestimmst du, was in deinen PC kommt. Starte jetzt und entdecke die Welt
              der
              grenzenlosen Möglichkeiten!</p>

            <img src={konfigurierenPic} alt="Konfigurator" className={appCSS.konfigImg} />
            <div className={appCSS.btncenter}>
            <Link to={"/konfigurator/cpu"} className={appCSS.navigate}>Zum Konfigurator</Link>
            </div>
          </div>
          <div className={appCSS['pcDone']}>
            <h1 className={appCSS.headline}>Vorgefertigte PC's anschauen</h1>
            <p>Entdecke unsere vorgefertigten PCs optimale Leistung, Zuverlässigkeit und Stil in einem</p>
            <p>Von Gaming bis zu Arbeitsstationen finde deinen perfekten PC, einsatzbereit und von Experten kuratiert</p>
            <p>Einfach auspacken und loslegen. Finde heute deinen idealen Begleiter in der Welt der vorgefertigten PCs!</p>

            <img src={gamingPic} alt="" className={appCSS['gamingPc']} />
            <div className={appCSS.btncenter}>
            <Link to={"/fertigpc"} className={appCSS.navigate}>Zu Fertige PC's</Link>
            </div>
          </div>
          <div className={appCSS.trends}>
            <h1 className={appCSS.headline}>Trends und News</h1>
            <p>Tauche ein in die neuesten Trends und News der Tech-Welt! </p>
            <p>Wir halten dich stets auf dem Laufenden über die innovativsten Technologien, aufregendsten
              Entwicklungen Produkte.</p>
            <p>Ob bahnbrechende Gadgets, Software-Revolutionen oder die heißesten Trends der Branche – wir bringen
              dir die wichtigsten Informationen direkt auf den Bildschirm.</p>

            <div className={appCSS.trends}>
              <div>
                <h3>Gerade in:</h3>
                <div className={appCSS.trendsBoxContainer}>
                  {data.map((item: any) => (
                    <div key={item.itemsnr} className={appCSS.trendsBox}>

                      <p className={appCSS.trendsName}>Name: {item.name}</p>
                      <p>Type: {item.typeof} </p>


                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className={appCSS.support}>
          <div className={appCSS.supportText}>
            <h1 className={appCSS.headline}>Kundensupport</h1>
            <p className={appCSS.text}>Falls es Probleme mit dem Konfigurator oder dem Produkt hast, <br />
              Kontaktiere uns einfach!</p>
            <p className={appCSS.text}>Unser Support hilft dir gerne</p>
          </div>
          <div className={appCSS.contact}>
            <a href="mailto:confignow@web.de" className={appCSS.contactlink}>Kontaktiere uns</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
