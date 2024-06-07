import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isSignedIn } from "Util/Auth";
import heart from './icons/heart.svg';
import heartFilled from './icons/heartFilled.svg'; 
import { isArabic } from "Util/App"; 
import { showNotification } from "Store/Notification/Notification.action";
import MobileAPI from "Util/API/provider/MobileAPI";
import BrowserDatabase from "Util/BrowserDatabase";


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
            if(props.brand_name.toLowerCase() === res?.name?.toLowerCase()) {
                setisFollowActive(res?.name !== '') 
                dispatch(showNotification(
                    'success',
                    __("You Followed this Brand")
                ));
            } else {
                setisFollowActive(res?.name);
                dispatch(showNotification(
                    'success',
                    __("You Unfollowed this Brand")
                ));
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
        const selectedItem = res.length > 0 && res.filter(item => {
            return props.brand_name.toLowerCase() === item?.name?.toLowerCase()
        });
        setisFollowActive(selectedItem.length > 0);
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