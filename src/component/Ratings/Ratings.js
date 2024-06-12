import {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import './Ratings.style.scss';
import ModalOverlay from 'Component/ModalOverlay/ModalOverlay';
import { isArabic } from "Util/App";
import RatingPopup from "./RatingPopup";
import { formatNumber } from 'Util/Ratings/Ratings';
import { getStore } from "Store";
import Event, {
    EVENT_PDP_RATING_CLICK,
    MOE_trackEvent
  } from "Util/Event";
import stars from "./icons/stars.svg";
import { setAddtoCartInfo } from "Store/PDP/PDP.action";


const Ratings = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const newinfoText = __("Ratings");
    const country = getStore()?.getState()?.AppState?.country;
    const config = useSelector(state => state.AppConfig.config);
    const addtoCartInfo = useSelector(state => state.PDP.addtoCartInfo)
    const { uMinAvgRating, uMinRatingCount} = config?.countries[country];
    const dispatch = useDispatch();
    const {
        rating_brand,
        rating_sku,
        productSku
    } = props;

    if(!rating_sku){
        if(!addtoCartInfo.hasOwnProperty("product_rating")){
            dispatch(setAddtoCartInfo({
                "product_rating":0,
                "no_of_ratings":0
            }));
        }
        return null;
    }
    const {
        average_ratings, 
        total_ratings,
        prdAverageRatings = +average_ratings,
        prdTotalRatings = +total_ratings,
    } =  rating_sku;

    useEffect(() => {
         dispatch(setAddtoCartInfo({
            "product_rating":prdAverageRatings,
            "no_of_ratings":prdTotalRatings
        }));
    },[])
    // const min_average_ratngs = Math.max(rating_sku?.min_avg_rating, rating_brand?.min_avg_rating, uMinAvgRating);
    // const min_ratings_count = Math.max(rating_sku?.min_rating_count, rating_brand?.min_rating_count, uMinRatingCount);

    const thresholdAverageRatings = +rating_sku?.min_avg_rating > 0 ? +rating_sku?.min_avg_rating : +rating_brand?.min_avg_rating > 0 ? +rating_brand?.min_avg_rating : uMinAvgRating;
    const thresholdRatingsCount = +rating_sku?.min_rating_count > 0 ? +rating_sku?.min_rating_count : +rating_brand?.min_rating_count > 0 ? +rating_brand?.min_rating_count : uMinRatingCount;

    if(prdAverageRatings < thresholdAverageRatings || prdTotalRatings < thresholdRatingsCount){
        return null;
    }
    
    const totalRatings = formatNumber(prdTotalRatings);
    const modalHandlerOpen = () => {
        setIsModalOpen(true);
        const eventData = {
            product_rating:prdAverageRatings,
            no_of_ratings:prdTotalRatings,
            product_sku:productSku
        }
        /* MOE events */
        MOE_trackEvent(EVENT_PDP_RATING_CLICK,eventData);
        /* GTM EVENT */
        Event.dispatch(EVENT_PDP_RATING_CLICK,eventData);
    }
    const modalHandlerClose = () => {
        setIsModalOpen(false);
    }

    return (
        <div className={`${props.className ? props.className :''} ratings ${ isArabic() ? 'ratings_isArabic' : ''}`}>
            <div block="ratings-summary" onClick={modalHandlerOpen}>
                <span block="ratings-summary" elem="rating">
                    <span block="ratings-summary" elem="text">{prdAverageRatings}</span>
                    <img block="ratings" elem="icon" src={stars} /> 
                </span>
            
                <span block="ratings-summary" elem="separator">|</span>
                <span block="ratings-summary" elem="totalReview">   
                    <span block="ratings-totalReview" elem="count">{totalRatings}</span>
                    <span block="ratings-totalReview" elem="text">{newinfoText}</span>
                </span>

            </div>
            {isModalOpen && 
                <ModalOverlay popupName="rating" className="ratingDetail fromBottom" open={isModalOpen} onConfirm={modalHandlerClose}>
                    <RatingPopup key='rating' {...rating_sku}  />
                </ModalOverlay>
            }
        </div>
    )
}

export default Ratings;