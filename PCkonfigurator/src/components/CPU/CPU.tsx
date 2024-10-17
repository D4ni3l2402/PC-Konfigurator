import './CPU.css'

import AMD from '../../assets/amd 1.png'
import Intel from '../../assets/intel.png'
import { useContext } from 'react';
import { BrandContext } from '../../context/BrandContext';
import { useNavigate } from 'react-router-dom';

function CPU() {

    const navigate = useNavigate();

    const brandContext = useContext(BrandContext);
    const selectBrandCPU = brandContext?.selectBrandCPU;
    const setSelectBrandCPU = brandContext?.setSelectedBrandCPU;

    // const selectBrandCPU = useContext(BrandContext)?.selectBrandCPU;
    // const setSelectedBrandCPU = useContext(BrandContext)?.setSelectedBrandCPU;

    function setBrand(brand: string) {
        setSelectBrandCPU?.(brand);
        navigate("/konfigurator/gpu");
    }

    return (
        <>
            <div className="cpu-container">
                <div className="cpuTitle">
                    <h1>Waehle deinen Prozessor</h1>
                </div>

                <div className="cpu-click">
                    <div className="amd" onClick={() => setBrand("AMD")}>
                        <img src={AMD} alt="AMD" />
                    </div>
                    <div className="intel" onClick={() => setBrand("INTEL")}>
                        <img src={Intel} alt="Intel" />
                    </div>
                </div>

            </div>
        </>
    );
}

export default CPU;