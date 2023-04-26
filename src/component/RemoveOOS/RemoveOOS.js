import React from 'react';
import { connect } from 'react-redux';
import "./RemoveOOS.style";
import red_broken_heart from "./red_broken_heart.png";
import Image from "Component/Image";
import { removeBulk } from "Util/API/endpoint/Cart/Cart.enpoint";
import ClickOutside from 'Component/ClickOutside';
import history from "Util/History";
import CartDispatcher from "Store/Cart/Cart.dispatcher";

export const mapDispatchToProps = (dispatch) => ({
    updateTotals: (cartId) => CartDispatcher.getCartTotals(dispatch, cartId),
});

function RemoveOOS({closeremoveOosOverlay, totals, updateTotals, isArabic}) {

    const checkProducts = (items = {}) => Object.entries(items).reduce((acc, item) => {
        if (item[1].availableQty === 0 || item[1].availableQty < item[1].qty) {
            const item1 = {...item[1], id: item[1].item_id}
            acc.push(item1);            
        }
        return acc;
    }, []);

    const checkIsAvailableProducts = (items = {}) => Object.entries(items).reduce((acc, item) => {
        if (item[1].availableQty != 0 || item[1].availableQty >= item[1].qty) {
            const item1 = {...item[1], id: item[1].item_id}
            acc.push(item1);            
        }
        return acc;
    }, []);

    async function removeOosBulk(items, availableItems) {
        const cart = JSON.parse(localStorage.getItem("CART_ID_CACHE_KEY"));
        const cartId = cart?.data;
        const response = await removeBulk(cartId, items)
        if(response) {
            const resp = updateTotals(cartId);
            if(availableItems.length > 0) {
                history.push("/cart")
            }
        }
    }

    const removeOosProducts = () => {
        const {
              items = [] ,
        } = totals;

        if (items.length !== 0) {
            const mappedItems = checkProducts(items) || [];
            const availableItems = checkIsAvailableProducts(items) || [];

            if(mappedItems) {
                removeOosBulk(mappedItems, availableItems);
            }
        }

        closeremoveOosOverlay(false);
    }

    const onClickOutSide = () => {
        closeremoveOosOverlay(false);
    }

  return (
    <div block="overlayWrapper">
        <ClickOutside onClick={ onClickOutSide }>
            <div block="removeOosOverlay" mods={{isArabic}}>
                <div className="closebuttonDiv">
                    <button 
                        onClick={(e)=>{closeremoveOosOverlay(false)}} 
                        block="closePopupbtn" 
                        mods={{isArabic}}
                        ><span>Close</span>
                    </button>
                </div>

                <div block="image_wrapper">
                    <Image
                        lazyLoad={true}
                        src={red_broken_heart}
                        alt="red_broken_heart icon" 
                    />
                </div>

                <div block="titleRemoveOos">
                    <h1>
                        {__("Ooops... It's gone!")}
                    </h1>
                </div>

                <div block="removeOssMessageWrapper">
                    <p>
                        {__("Please remove any unavailable items from the cart.")}
                    </p>
                </div>
                
                <div
                    block="removeOosButtonWrapper"
                >
                    <button
                        block="removeOosButton"
                        onClick={()=>{removeOosProducts()}}
                    >
                        {__("Remove Out Of Stock Items")}
                    </button>
                </div>

            </div>
        </ClickOutside>
    </div>
  )
}

export default connect(null, mapDispatchToProps)(RemoveOOS);
