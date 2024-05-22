import {useState} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import './Ratings.style.scss';
import ModalOverlay from 'Component/ModalOverlay/ModalOverlay';
import isMobile from "Util/Mobile";
import Overlay from "SourceComponent/Overlay";
import { isArabic } from "Util/App";
import RatingPopup from "./RatingPopup";

import stars from "./icons/stars.svg";

const rating_info = {
    ratings:80,
    average_ratings:4.8,
    one_rating:10,
    two_rating:10,
    three_rating:20,
    four_rating:30,
    five_rating:20,
}


const Ratings = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const product = useSelector(state => state.PDP.product);
    const config = useSelector(state => state.AppConfig.config);
    const newinfoText = __('Ratings');
    const k = __('k')
   
    const { ratings, average_ratings} =  rating_info;

    // console.log('----Appconfg',config);
    // console.log('----asdas',product);

    // const incrementHandler = () => {
    //     dispatch({
    //         type:'increment'
    //     })
    // }

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
                    <span block="ratings-totalReview" elem="count">{ratings}{k}</span>
                    <span block="ratings-totalReview" elem="text">{newinfoText}</span>
                </span>

            </div>
            {isModalOpen && 
                <ModalOverlay  className="ratingDetail fromBottom" open={isModalOpen} onConfirm={modalHandlerClose}>
                    <RatingPopup {...rating_info} />
                </ModalOverlay>
            }
        </div>
    )
}

export default Ratings;