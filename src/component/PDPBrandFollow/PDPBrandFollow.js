import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isSignedIn } from "Util/Auth";
import heart from './icons/heart.svg';
import heartFilled from './icons/heartFilled.svg'; 
import { isArabic } from "Util/App"; 
import { showNotification } from "Store/Notification/Notification.action";
import MobileAPI from "Util/API/provider/MobileAPI";
import BrowserDatabase from "Util/BrowserDatabase";
import Event, {
    EVENT_PDP_FOLLOW_BRAND,
    EVENT_PDP_UNFOLLOW_BRAND,
    MOE_trackEvent
  } from "Util/Event";
  import { setAddtoCartInfo } from "Store/PDP/PDP.action";


import './PDPBrandFollow.style';

const PDPBrandFollow = (props) => {
    
    const {renderMySignInPopup } = props;
    const dispatch = useDispatch();
    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const [isFollowActive, setisFollowActive] = useState(false);

    const customer = BrowserDatabase.getItem("customer");
    const userID = customer && customer.id ? customer.id : null;

    useEffect(() => {
       onLoadHandler();
       return () => {
        setIsLoadingFollow(false);
       }
    },[userID]);

    const onLoadHandler = async () => {
        setIsLoadingFollow(true); 
        if(isSignedIn()){
            getListOnLoad();
        } else {
            setIsLoadingFollow(false); 
            setisFollowActive(false);
            dispatch(
                setAddtoCartInfo({
                    "is_following_brand":false,
                    followAPI:true
                }));
        }
    }

    const onClickHandler = () => {
        setIsLoadingFollow(true); 
        if(isSignedIn()){
            // !isItemTheir && isFollowing(!isFollowActive);
            isFollowing();
        } else {
            renderMySignInPopup(() => {
                // isSignedIn() && !isItemTheir && getListOnLoad(onClickHandler)
                isSignedIn() && isFollowing();
                !isSignedIn() && setIsLoadingFollow(false);
            });
        }
    }
    const isFollowing = async () =>{
        try {
            let data = {};
            data.type = 'brand';
            data.name = props.brand_name;
            data.follow = !isFollowActive;
            const res = await MobileAPI.post('follow', data);
            const eventData ={
                product_sku:props.sku,
                brand_name:props.brand_name
            };
            
            if(props.brand_name.toLowerCase() === res?.data?.name?.toLowerCase()) {
                setisFollowActive(res?.data?.name !== '') 
                dispatch(showNotification(
                    'success',
                    __("You Followed this Brand")
                ));
                /* MOE events */
                MOE_trackEvent(EVENT_PDP_FOLLOW_BRAND,eventData);
                /* GTM EVENT */
                Event.dispatch(EVENT_PDP_FOLLOW_BRAND,eventData);

                dispatch(setAddtoCartInfo({
                    "is_following_brand":true,
                    followAPI:true
                }));
            } else {
                setisFollowActive(res?.data?.name);
                dispatch(showNotification(
                    'success',
                    __("You Unfollowed this Brand")
                ));
                /* MOE events */
                MOE_trackEvent(EVENT_PDP_UNFOLLOW_BRAND,eventData);
                /* GTM EVENT */
                Event.dispatch(EVENT_PDP_UNFOLLOW_BRAND,eventData);

                dispatch(setAddtoCartInfo({
                    "is_following_brand":false,
                    followAPI:true
                }));
            } 
            setIsLoadingFollow(false);
            
        }
        catch(err){
            console.error("Error", err);
            setIsLoadingFollow(false);
        }
    }

    const getListOnLoad = async () => {
        const res = await MobileAPI.get('follow/list');
        const selectedItem = res?.data?.length > 0 && res?.data?.filter(item => {
            return props.brand_name.toLowerCase() === item?.name?.toLowerCase()
        });
        setisFollowActive(selectedItem.length > 0);
        dispatch(setAddtoCartInfo({
            "is_following_brand":selectedItem.length > 0 ? true : false,
            followAPI:true
        }));
        // isItemTheir = selectedItem.length > 0;
        // !isItemTheir && fn && fn();
        setIsLoadingFollow(false);
    }

    return <>
        <a className={`brandFollow ${isArabic() ? '_isArabic':''} ${isLoadingFollow ? "disabled" :''}`} onClick={onClickHandler} title={isFollowActive ? __('Following') :__('Follow')} disabled={isLoadingFollow}>
            <img block="brandFollow" elem="icon" src={isFollowActive ? heartFilled : heart} />
            <span block="brandFollow" elem="text">{isFollowActive ? __('Following') :__('Follow')}</span>
        </a>
    </>
}

export default PDPBrandFollow;