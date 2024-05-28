import {useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import './Ratings.style.scss';
import ModalOverlay from 'Component/ModalOverlay/ModalOverlay';
import isMobile from "Util/Mobile";
import { isArabic } from "Util/App";
import RatingPopup from "./RatingPopup";
import { formatNumber } from 'Util/Ratings/Ratings';
import { getStore } from "Store";

import stars from "./icons/stars.svg";


const Ratings = (props) => {
    const country = getStore()?.getState()?.AppState?.country;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const newinfoText = __("Ratings");
    const config = useSelector(state => state.AppConfig.config);
    const { uMinAvgRating, uMinRatingCount} = config?.countries[country];
    const {
        rating_brand,
        rating_sku
    } = props;

    if(!rating_sku){
        return null;
    }
    const {
        average_ratings, 
        total_ratings, 
        min_avg_rating : p_min_avg_rating,
        min_rating_count:p_min_rating_count
    } =  rating_sku;

    const min_average_ratngs = Math.max(rating_sku?.min_avg_rating, rating_brand?.min_avg_rating, uMinAvgRating);
    const min_ratings_count = Math.max(rating_sku?.min_rating_count, rating_brand?.min_rating_count, uMinRatingCount);

    if(average_ratings <= min_average_ratngs && total_ratings <= min_ratings_count){
        return null;
    }
    const totalRatings = formatNumber(total_ratings);
    const modalHandlerOpen = () => {
        setIsModalOpen(true);
    }
    const modalHandlerClose = () => {
        setIsModalOpen(false);
    }

    return (
        <div className={`${props.className ? props.className :''} ratings ${ isArabic() ? 'ratings_isArabic' : ''}`}>
            <div block="ratings-summary" onClick={modalHandlerOpen}>
                <span block="ratings-summary" elem="rating">
                    <span block="ratings-summary" elem="text">{average_ratings}</span>
                    <img block="ratings" elem="icon" src={stars} /> 
                </span>
               
                <span block="ratings-summary" elem="separator">|</span>
                <span block="ratings-summary" elem="totalReview">   
                    <span block="ratings-totalReview" elem="count">{totalRatings}</span>
                    <span block="ratings-totalReview" elem="text">{newinfoText}</span>
                </span>

            </div>
            {isModalOpen && 
                <ModalOverlay  className="ratingDetail fromBottom" open={isModalOpen} onConfirm={modalHandlerClose}>
                    <RatingPopup key='rating' {...rating_sku} />
                </ModalOverlay>
            }
        </div>
    )
}

export default Ratings;