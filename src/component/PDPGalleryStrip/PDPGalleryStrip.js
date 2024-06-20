import {useEffect, useState} from 'react';
import './PDPGalleryStrip.style';
import { isArabic } from "Util/App";
import MobileAPI from "Util/API/provider/MobileAPI";
import bags from './icons/bags.png';
import eyes from './icons/eyes.png';
import { setAddtoCartInfo } from "Store/PDP/PDP.action";
import { useDispatch } from 'react-redux';



const PDPGalleryStrip = (props) => {
    const addTobagText = __('Added this to Bag');
    const otherAreViewText = __('Others are viewing');
    const [isATBViewing, setisATBViewing] = useState(true);
    const [isOAVViewing, setisOAVViewing] = useState(false);
    const [isAddtoBagCount, setisAddTobagCount] = useState(0);
    const [isOtherAreView, setisOtherAreViewing] = useState(0);
    const dispatch = useDispatch();
    useEffect(() => {
        const {productId, sku} = props;
        let myInterval;
        const fetchData = async () => {
            try {
                // Make multiple API calls simultaneously
                const [resSendMyView, resOthersViewing, resAddedToBag] = await Promise.all([
                    MobileAPI.post(`product-view/${productId}`),
                    MobileAPI.get(`product-count/${productId}`),
                    MobileAPI.get(`brought-count?sku=${sku}`)
                ]);

                // Extract data from responses
                const sendMyView = await resSendMyView?.data[0];
                const otherView = await resOthersViewing?.data[0];
                const addToBag = await resAddedToBag?.data[0];

                sendMyView.status > 0 && console.log('my view count');

                // Update state with fetched data
                setisAddTobagCount(addToBag.count);
                setisOtherAreViewing(otherView.count);

                if(addToBag.count && otherView.count){
                    myInterval =  setInterval(() => {
                        setisATBViewing(prev => !prev);
                        setisOAVViewing(prev => !prev);
                    }, 3000);
                } else {
                    setisATBViewing(addToBag.count > 0);
                    setisOAVViewing(otherView.count > 0);
                }
                dispatch(setAddtoCartInfo({
                    "user_view_count":otherView.count > 0 ? otherView.count : 0,
                    "user_added_to_cart_count":addToBag.count > 0 ? addToBag.count : 0,
                    productAPI:true
                }))

            } catch (error) {
                dispatch(setAddtoCartInfo({
                    "user_view_count":0,
                    "user_added_to_cart_count":0,
                    productAPI:true
                }))
                console.error('Error fetching data:', error);
            }
        };
        
        // Fetch data initially
        fetchData();

        return () => myInterval && clearInterval(myInterval);
        
    },[]);

    return (
        <div className={`${props.className} PDPGalleryStrip ${isArabic() ? 'isArabic' :''}`} style={{display:isAddtoBagCount > 0 || isOtherAreView > 0 ? 'block':'none'}}>
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