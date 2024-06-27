
import './Ratings.style.scss';
import { isArabic } from "Util/App";
import stars from "./icons/stars.svg";
import { percentageRating, formatNumber } from 'Util/Ratings/Ratings';

const RatingPopup = (props) => {
    let ratingTitle = __("Customer Rating");
    let verifierBuyer = __("verified Buyers");
    const {
        average_ratings, 
        total_ratings, 
        one_rating,
        two_rating, 
        three_rating, 
        four_rating, 
        five_rating,
        prdAverageRatings = +average_ratings,
        prdTotalRatings = +total_ratings,
    } =  props;

    const allStarCount = [
        +one_rating,
        +two_rating, 
        +three_rating, 
        +four_rating, 
        +five_rating
    ];
    const totalRatings = formatNumber(prdTotalRatings);

    return (
        <div block="ratings-detailPop"  mods={{isArabic : isArabic() }}>
            <h3 block="ratings-detailPop" elem="title" >{ratingTitle}</h3>
            <div block="ratings-Info">
                <div block="ratings-avg">
                    <h4 block="ratings-avg" elem="title">
                        <span>{prdAverageRatings}</span>
                        <img block="ratings" elem="icon"  mods={ { isLarge: true } } src={stars} />
                    </h4>
                    <span block="ratings-avg" elem="text">
                        {totalRatings} {verifierBuyer}
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
                                    <span block="ratings-starItem" elem="barSelected" style={{width:`${percentageRating(item,prdTotalRatings)}`}}></span>
                                </span>
                                <span block="ratings-starItem" elem="text">{`${percentageRating(item, prdTotalRatings)}`}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default RatingPopup