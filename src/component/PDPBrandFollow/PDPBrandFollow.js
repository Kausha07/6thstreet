import { useState, useEffect } from 'react';
import { isSignedIn } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import heart from './icons/heart.svg';
import heartFilled from './icons/heartFilled.svg'; 
import { isArabic } from "Util/App";    

import './PDPBrandFollow.style';

const PDPBrandFollow = (props) => {
    

    const [isLoadingFollow, setIsLoadingFollow] = useState(false);
    const [isFollowActive, setisFollowActive] = useState(false);
    let aftersignDone, maxFnExcue = 0;

    useEffect(() => {
       onLoadHandler();
       return () => {
        clearTimeout(aftersignDone);
       }
    },[]);

    const onClickHandler = () => {
        setIsLoadingFollow(true); 
        const {renderMySignInPopup } = props;
        if(isSignedIn()){
            isFollowing(!isFollowActive);
        } else {
            renderMySignInPopup(() => {
                isFollowing(!isFollowActive);
            });

        }
    }

    const onLoadHandler = () => {
        setIsLoadingFollow(true); 
        isFollowing();
    }

    const isFollowing = (isFollow) =>{
        let data = {};
        if(isSignedIn()){ 
            const customer = BrowserDatabase.getItem("customer");
            const userID = customer && customer.id ? customer.id : null;
            // const userID = null;
            if(userID && props.brand_name){
                data.userID = userID;
                data.brand_name = props.brand_name;
                if(isFollow){
                    data.isFollow = isFollow;
                }
                console.log('--009900--',data);
                isFollowOrNot(data);
                clearTimeout(aftersignDone);
            } else {
                aftersignDone = setTimeout(() => {
                    isFollowing();
                    maxFnExcue++
                    if(maxFnExcue >= 8){
                        clearTimeout(aftersignDone);
                        setIsLoadingFollow(false);
                    }
                },500);
            }
           
        } else {
            console.log('--009900--',data);
            setIsLoadingFollow(false); 
        }
    }

    async function isFollowOrNot(data){
        // user, brandname, true
            try {
                //   const response = await MobileAPI.post(`url`,  data);
                const response = {
                    userID:data.userID,
                    brand_name: props.brand_name,
                    isFollow:data.isFollow ? data.isFollow : false
                }

                props.brand_name === response.brand_name && setisFollowActive(response.isFollow);
            
                setIsLoadingFollow(false); 
            }
            catch(err){
                console.error("Error", err);
                setIsLoadingFollow(false);
            }
      }


    return <>
        <a className={`BrandFollow ${isArabic() ? '_isArabic':''} ${isLoadingFollow ? "disabled" :''}`} onClick={onClickHandler} title={isFollowActive ? __('Following') :__('Follow')} disabled={isLoadingFollow}>
            <img block="BrandFollow" elem="icon" src={isFollowActive ? heartFilled : heart} />
            <span block="BrandFollow" elem="text">{isFollowActive ? __('Following') :__('Follow')}</span>
        </a>
    </>
}

export default PDPBrandFollow;