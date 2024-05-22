import {useEffect, useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import './PDPGalleryStrip.style';
import { isArabic } from "Util/App";
import MobileAPI from "Util/API/provider/MobileAPI";
import bags from './icons/bags.png';
import eyes from './icons/eyes.png';

const addToBagThreshold = 10;
const otherAreViewThreshold = 10;

const PDPGalleryStrip = (props) => {
    const addTobagText = __('Added To Bag');
    const otherAreViewText = __('Others are viewing');
    const [isATBViewing, setisATBViewing] = useState(true);
    const [isOAVViewing, setisOAVViewing] = useState(false);
    const [isAddtoBagCount, setisAddTobagCount] = useState(addTobagHandler);
    const [isOtherAreView, setisOtherAreViewing] = useState(otherAreView);
    const config = useSelector(state => state.AppConfig.config);


    useEffect(() => {
        let myInterval;
        meViewingHandler();
        if(isAddtoBagCount > addToBagThreshold && isOtherAreView > otherAreViewThreshold){
             myInterval =  setInterval(() => {
                console.log('-----.....set Intervals')
                setisATBViewing(prev => !prev);
                setisOAVViewing(prev => !prev);
            }, 3000);
        } else{
            setisATBViewing(isAddtoBagCount > addToBagThreshold);
            setisOAVViewing(isOtherAreView > otherAreViewThreshold);
        }
        
        return () => {
            console.log('-----.......clear Intervals')
            myInterval && clearInterval(myInterval);
        }
    },[]);

    function defautlThreshold(){
        return [isAddtoBad, isOtherAreView]
    }

    function addTobagHandler(){
        try {
            // const { data } = await MobileAPI.get(`sku/${ returnId }`);
            return 12;
        } catch (e) {
            Logger.log(e);
        }
        
    }

    function otherAreView(){
        try {
            // const { data } = await MobileAPI.get(`sku/${ sku }`);
            return 20;
        } catch (e) {
            Logger.log(e);
        }
    }

    async function meViewingHandler(){
        try {
            // const { data } = await MobileAPI.get(`sku/${ sku }`);
            
        } catch (e) {
            Logger.log(e);
        }
    }


    return (
        <div className={`${props.className} PDPGalleryStrip ${isArabic() ? 'isArabic' :''}`} style={{display:isATBViewing || isOAVViewing ? 'block':'none'}}>
           { isAddtoBagCount > 0 && 
                <div className={`PDPGalleryStrip-elem ${isATBViewing ? 'active':'' }`}>
                    <img block='PDPGalleryStrip' elem='icon' src={bags} alt={`${isAddtoBagCount} ${addTobagText}`}/>
                    <span block='PDPGalleryStrip' elem='text'>
                        <i>{isAddtoBagCount}</i> 
                        {addTobagText}
                    </span>
                </div>}
           { isOtherAreView > 0 &&
                <div className={`PDPGalleryStrip-elem ${isOAVViewing ? 'active':'' }`}>
                    <img block='PDPGalleryStrip' elem='icon' src={eyes} alt={`${isOtherAreView} ${otherAreViewText}`}/>
                    <span block='PDPGalleryStrip' elem='text'>
                        <i>{isOtherAreView}</i>{otherAreViewText}
                    </span>
                </div>
                }
        </div>
    )
}

export default PDPGalleryStrip;