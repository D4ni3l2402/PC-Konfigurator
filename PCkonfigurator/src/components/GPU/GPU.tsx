import { useContext } from 'react';
import { BrandContext } from '../../context/BrandContext';
import { useNavigate } from 'react-router-dom';

import AMD from '../../assets/amd 1.png'
import NVIDIA from '../../assets/nvidia.png'
import Intel from '../../assets/intel.png'

import './GPU.css'

function GPU() {

    const navigate = useNavigate();

    const brandContext = useContext(BrandContext);
    const selectBrandGPU = brandContext?.selectBrandGPU;
    const setSelectBrandGPU = brandContext?.setSelectedBrandGPU;

    // const selectBrandCPU = useContext(BrandContext)?.selectBrandCPU;
    // const setSelectedBrandCPU = useContext(BrandContext)?.setSelectedBrandCPU;

    function setBrand(brand: string) {
        setSelectBrandGPU?.(brand);
        navigate("/konfigurator");
    }


    return ( 
        <>
        <div className="gpu-container">
            <div className="gpuTitle">
                <h1>Waehle deine Grafikkarte aus</h1>
            </div>

            <div className="gpu-click">
                <div className="amd" onClick={() => setBrand("AMD")}>
                    <img src={AMD} alt="AMD" />
                </div>
                <div className="nvidia" onClick={() => setBrand("NVIDIA")}>
                    <img src={NVIDIA} alt="NVIDIA" />
                </div>
                <div className="intel" onClick={() => setBrand("Intel")}>
                    <img src={Intel} alt="Intel" />
                </div>
            </div>
        </div>
        </>
     );
}

export default GPU;