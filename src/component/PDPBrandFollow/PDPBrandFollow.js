import { useState, useEffect } from 'react';
import { isSignedIn } from "Util/Auth";
import BrowserDatabase from "Util/BrowserDatabase";
import heart from './icons/heart.svg';
import heartFilled from './icons/heartFilled.svg'; 
import { isArabic } from "Util/App";   
import {getGraphqlEndpoint } from 'Util/Request/Request';
import { showNotification } from "Store/Notification/Notification.action"; 

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
            isFollowing(!isFollowActive, onClickHandler);
        } else {
            renderMySignInPopup(() => {
                isFollowing(!isFollowActive, onClickHandler);
            });

        }
    }

    const onLoadHandler = () => {
        setIsLoadingFollow(true); 
        // isFollowing('firstLoad');
        isFollowing();
    }

    const isFollowing = (isFollow, fn) =>{
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
                    fn();
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
        let query;
        let url = getGraphqlEndpoint();
        // console.log(data,data.isFollow);
            try {
                const response = {
                    userID:data.userID,
                    brand_name: props.brand_name,
                    isFollow:data.isFollow ? data.isFollow : false
                }
                // if(data.isFollow === 'firstLoad'){
                //     query = `{
                //         brandList{
                //             items{
                //                 ${props.brand_name}
                //             }
                //         }
                //     }`
                // }
                
                // if(data.isFollow){
                //     query = `
                //     mutation {
                //         followTheBrand(
                //           brand: ${props.brand_name}
                //         ) {
                //           "Follow the Brand"
                //         }
                //       }`;
                // }
                // if(!data.isFollow){
                //     query = `
                //     mutation {
                //         unfollowTheBrand(
                //           brand: ${props.brand_name}
                //         ) {
                //           "UnFollow the Brand"
                //         }
                //       }`;
                // }
                // const response = await MobileAPI.post(url,  data);
                // const response = {
                //     "data": {
                //         "brandList": {
                //           "items": [
                //             {
                //               "name": "brand 1"
                //             },
                //             {
                //               "name": "brand 2"
                //             },
                //             {
                //               "name": "Call it Spring"
                //             }
                //           ]
                //         }
                //     }
                //   }
                // const response = {
                //     "data": {
                //         "followTheBrand": {
                //             "message": __("The Brand name has been followed by you.")
                //         }
                //     }
                // }

                // console.log(response.data,'--qwas--');
                // if(Object.keys(response.data)[0] === 'brandList'){
                //     let brandList = response?.data?.brandList?.items;
                //     brandList.forEach((item) => {
                //         item.name === props.brand_name && setisFollowActive(true);
                //     })
                // }
                // if(Object.keys(response.data)[0] === 'followTheBrand'){
                //     showNotification(
                //         "success",
                //         __(response.data.followTheBrand?.message)
                //       );
                //       setisFollowActive(true);
                // }
                // if(Object.keys(response.data)[0] === 'unfollowTheBrand'){
                //     showNotification(
                //         "success",
                //         __(response.data.followTheBrand?.message)
                //       );
                //       setisFollowActive(false);
                // }

               
                props.brand_name === response.brand_name && setisFollowActive(response.isFollow);
                setIsLoadingFollow(false); 
            }
            catch(err){
                console.error("Error", err);
                setIsLoadingFollow(false);
            }
      }


    return <>
        <a className={`brandFollow ${isArabic() ? '_isArabic':''} ${isLoadingFollow ? "disabled" :''}`} onClick={onClickHandler} title={isFollowActive ? __('Following') :__('Follow')} disabled={isLoadingFollow}>
            <img block="brandFollow" elem="icon" src={isFollowActive ? heartFilled : heart} />
            <span block="brandFollow" elem="text">{isFollowActive ? __('Following') :__('Follow')}</span>
        </a>
    </>
}

export default PDPBrandFollow;