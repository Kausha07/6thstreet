
import './Ratings.style.scss';
import { isArabic } from "Util/App";
import stars from "./icons/stars.svg";

const RatingPopup = (props) => {
    let ratingTitle = __('Customer Rating');
    let verifierBuyer = __('verified Buyers');

    const allStarCount = [props.one_rating,props.two_rating, props.three_rating, props.four_rating, props.five_rating];

    const percentageRating = (item) => {
        return Math.round((item / props.ratings) * 100);
    }

    return (
        <div block="ratings-detailPop"  mods={{isArabic : isArabic() }}>
            <h3 block="ratings-detailPop" elem="title" >{ratingTitle}</h3>
            <div block="ratings-Info">
                <div block="ratings-avg">
                    <h4 block="ratings-avg" elem="title">
                        <span>{props.average_ratings}</span>
                        <img block="ratings" elem="icon"  mods={ { isLarge: true } } src={stars} />
                    </h4>
                    <span block="ratings-avg" elem="text">
                        {props.ratings} {verifierBuyer}
                    </span>
                </div>
                <div block="ratings-avg" elem="separator"></div>
                <div block="ratings-starList">
                    {allStarCount.reverse().map((item,i) => {
                        return(
                            <div block="ratings-starItem">
                                <span block="ratings-starItem" elem="text">{allStarCount.length - i}</span>
                                <img block="ratings" elem="icon" mods={ { isSmall: true } } src={stars} />
                                <span block="ratings-starItem" elem="bar">
                                    <span block="ratings-starItem" elem="barSelected" style={{width:`${percentageRating(item)}%`}}></span>
                                </span>
                                <span block="ratings-starItem" elem="text">{`${percentageRating(item)}%`}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default RatingPopup