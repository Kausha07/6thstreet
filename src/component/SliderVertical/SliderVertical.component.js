/* eslint-disable react/no-unused-state */

/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import PropTypes from 'prop-types';
import { Children, createRef, PureComponent } from 'react';

import Draggable from 'Component/Draggable';
import { ChildrenType, MixType } from 'Type/Common';
import CSS from 'Util/CSS';

import {
    ACTIVE_SLIDE_PERCENT,
    ANIMATION_DURATION
} from './SliderVertical.config';

import './SliderVertical.style';

/**
 * Slider component
 * @class Slider
 */
export class SliderVertical extends PureComponent {
    static propTypes = {
        showCrumbs: PropTypes.bool,
        activeImage: PropTypes.number,
        onActiveImageChange: PropTypes.func,
        mix: MixType,
        children: ChildrenType.isRequired,
        isInteractionDisabled: PropTypes.bool
    };

    static defaultProps = {
        activeImage: 0,
        onActiveImageChange: () => {},
        showCrumbs: false,
        isInteractionDisabled: false,
        mix: {}
    };

    sliderHeight = 0;

    prevPosition = 0;

    draggableRef = createRef();

    sliderRef = createRef();

    handleDragStart = this.handleInteraction.bind(this, this.handleDragStart);

    handleDrag = this.handleInteraction.bind(this, this.handleDrag);

    handleDragEnd = this.handleInteraction.bind(this, this.handleDragEnd);

    renderCrumb = this.renderCrumb.bind(this);

    constructor(props) {
        super(props);

        const { activeImage } = this.props;

        this.state = {
            draggableRef: null,
            prevActiveImage: activeImage,
            height: 0,
            sliderChildren: null,
            sliderHeightChildren: null,
            sliderHeight: null,
            count: 0,
            countPerPage: 0,
            isArrowUpHidden: true,
            isArrowDownHidden: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { activeImage } = props;
        const {
            draggableRef,
            prevActiveImage,
            sliderChildren,
            sliderHeightChildren,
            count,
            countPerPage
        } = state;

        if (activeImage > prevActiveImage) {
            if (activeImage === count) {
                const newTranslate = sliderChildren.length / count < 2
                    ? -(sliderChildren.length - countPerPage) * sliderHeightChildren
                    : -((countPerPage - 1) * sliderHeightChildren);

                CSS.setVariable(
                    draggableRef,
                    'animation-speed',
                    `${ Math.abs((prevActiveImage - activeImage) * ANIMATION_DURATION) }ms`
                );

                CSS.setVariable(
                    draggableRef,
                    'translateY',
                    `${newTranslate}px`
                );

                if (activeImage === sliderChildren.length - 1) {
                    return {
                        prevActiveImage: activeImage,
                        count: sliderChildren.length,
                        isArrowDownHidden: activeImage === sliderChildren.length - 1
                    };
                }

                return {
                    prevActiveImage: activeImage,
                    count: count + countPerPage - 1,
                    isArrowDownHidden: activeImage === sliderChildren.length - 1
                };
            }
        }

        if (activeImage < prevActiveImage) {
            if (activeImage === count - countPerPage - 1) {
                const newTranslate = count / countPerPage > 2
                    ? -(countPerPage - 1) * sliderHeightChildren
                    : 0;

                CSS.setVariable(
                    draggableRef,
                    'animation-speed',
                    `${ Math.abs((prevActiveImage - activeImage) * ANIMATION_DURATION) }ms`
                );

                CSS.setVariable(
                    draggableRef,
                    'translateY',
                    `${newTranslate}px`
                );

                if (newTranslate === 0) {
                    return {
                        prevActiveImage: activeImage,
                        count: countPerPage,
                        isArrowUpHidden: activeImage === 0
                    };
                }

                return {
                    prevActiveImage: activeImage,
                    count: count - countPerPage,
                    isArrowUpHidden: activeImage === 0
                };
            }
        }

        if (prevActiveImage !== activeImage) {
            return {
                prevActiveImage: activeImage,
                isArrowUpHidden: activeImage === 0,
                isArrowDownHidden: activeImage === sliderChildren.length - 1
            };
        }

        return null;
    }

    componentDidMount() {
        const { draggableRef } = this;
        const sliderChildren = draggableRef.current.children;
        const sliderHeightChildren = draggableRef.current.children[0].offsetHeight;
        const sliderHeight = draggableRef.current.offsetHeight;
        const countPerPage = Math.round(sliderHeight / sliderHeightChildren);

        // eslint-disable-next-line no-magic-numbers
        this.setState({
            draggableRef,
            sliderChildren,
            sliderHeightChildren,
            sliderHeight,
            countPerPage,
            count: countPerPage
        });

        console.log(countPerPage);

        if (!sliderChildren || !sliderChildren[0]) {
            return;
        }

        sliderChildren[0].onload = () => {
            CSS.setVariable(this.sliderRef, 'slider-width', `${sliderChildren[0].offsetHeight}px`);
        };

        setTimeout(() => {
            CSS.setVariable(this.sliderRef, 'slider-width', `${sliderChildren[0].offsetHeight}px`);
        }, ANIMATION_DURATION);
    }

    onArrowUpClick = () => {
        const { onActiveImageChange, activeImage } = this.props;

        // if (activeImage === 1) {
        //     this.setState({ isArrowUpHidden: true });
        // }
        onActiveImageChange(activeImage - 1);
    };

    onArrowDownClick = () => {
        const { onActiveImageChange, activeImage } = this.props;
        onActiveImageChange(activeImage + 1);
    };

    onClickChangeSlide(state, slideSize, lastTranslate, fullSliderSize) {
        const { originalY } = state;
        const { prevActiveImage: prevActiveSlider } = this.state;
        // const { onActiveImageChange } = this.props;

        const fullSliderPoss = Math.round(fullSliderSize / slideSize);
        const elementPossitionInDOM = this.draggableRef.current.getBoundingClientRect().x;

        const sliderPossition = -prevActiveSlider;
        const realElementPossitionInDOM = elementPossitionInDOM - lastTranslate;
        const mousePossitionInElement = originalY - realElementPossitionInDOM;

        if (slideSize / 2 < mousePossitionInElement && -fullSliderPoss < sliderPossition) {
            console.log('here');
        }

        if (slideSize / 2 > mousePossitionInElement && lastTranslate) {
            console.log('here');
            console.log('here');
        }

        return sliderPossition;
    }

    getFullSliderHeight() {
        const fullSliderHeight = this.draggableRef.current.scrollHeight;
        return fullSliderHeight - this.sliderHeight;
    }

    calculateNextSlide(state) {
        const {
            translateY: translate,
            lastTranslateY: lastTranslate
        } = state;

        const { onActiveImageChange } = this.props;

        const slideSize = this.sliderHeight;

        const fullSliderSize = this.getFullSliderHeight();

        const activeSlidePosition = translate / slideSize;
        const activeSlidePercent = Math.abs(activeSlidePosition % 1);
        const isSlideBack = translate > lastTranslate;

        if (!translate) {
            return this.onClickChangeSlide(state, slideSize, lastTranslate, fullSliderSize);
        }

        if (translate >= 0) {
            onActiveImageChange(0);
            return 0;
        }

        if (translate < -fullSliderSize) {
            const activeSlide = Math.round(fullSliderSize / -slideSize);
            onActiveImageChange(-activeSlide);
            return activeSlide;
        }

        if (isSlideBack && activeSlidePercent < 1 - ACTIVE_SLIDE_PERCENT) {
            const activeSlide = Math.ceil(activeSlidePosition);
            onActiveImageChange(-activeSlide);
            return activeSlide;
        }

        if (!isSlideBack && activeSlidePercent > ACTIVE_SLIDE_PERCENT) {
            const activeSlide = Math.floor(activeSlidePosition);
            onActiveImageChange(-activeSlide);
            return activeSlide;
        }

        const activeSlide = Math.round(activeSlidePosition);
        onActiveImageChange(-activeSlide);
        return activeSlide;
    }

    handleDragStart() {
        CSS.setVariable(this.draggableRef, 'animation-speed', '0');
    }

    handleDrag(state) {
        const { translateY } = state;

        const translate = translateY;

        const fullSliderSize = this.getFullSliderHeight();

        if (translate < 0 && translate > -fullSliderSize) {
            CSS.setVariable(
                this.draggableRef,
                'translateY',
                `${translate}px`
            );
        }
    }

    handleDragEnd(state, callback) {
        const activeSlide = this.calculateNextSlide(state);

        const slideSize = this.sliderHeight;

        const newTranslate = activeSlide * slideSize;

        CSS.setVariable(this.draggableRef, 'animation-speed', '300ms');

        CSS.setVariable(
            this.draggableRef,
            'translateX',
            `${newTranslate}px`
        );

        callback({
            originalY: newTranslate,
            lastTranslateY: newTranslate
        });
    }

    handleClick = (state, callback, e) => {
        if (e.type === 'contextmenu') {
            this.handleDragEnd(state, callback);
        }
    };

    handleInteraction(callback, ...args) {
        const { isInteractionDisabled } = this.props;

        if (isInteractionDisabled || !callback) {
            return;
        }

        callback.call(this, ...args);
    }

    changeActiveImage(activeImage) {
        const { onActiveImageChange } = this.props;
        onActiveImageChange(activeImage);
    }

    renderCrumbs() {
        const { children } = this.props;
        if (children.length <= 1) {
            return null;
        }

        return (
            <div
              block="SliderVertical"
              elem="Crumbs"
            >
                { Children.map(children, this.renderCrumb) }
            </div>
        );
    }

    renderCrumb(_, i) {
        const { activeImage } = this.props;
        const isActive = i === Math.abs(-activeImage);

        return (
            <button
              block="SliderVertical"
              elem="Image"
              mods={ { type: 'single' } }
              // eslint-disable-next-line react/jsx-no-bind
              onClick={ () => this.changeActiveImage(i) }
            >
                <div
                  block="SliderVertical"
                  elem="Crumb"
                  mods={ { isActive } }
                />
            </button>
        );
    }

    render() {
        const {
            showCrumbs,
            mix,
            activeImage,
            children
        } = this.props;

        const { isArrowUpHidden, isArrowDownHidden } = this.state;

        return (
            <div
              block="SliderVertical"
              mix={ mix }
              ref={ this.sliderRef }
            >
                <button
                  block="SliderVertical"
                  elem="ButtonUp"
                  mods={ { isArrowUpHidden } }
                  onClick={ this.onArrowUpClick }
                >
                    <div block="SliderVertical" elem="ArrowUp" />
                </button>
                <Draggable
                  mix={ { block: 'SliderVertical', elem: 'Wrapper' } }
                  draggableRef={ this.draggableRef }
                  onDragStart={ this.handleDragStart }
                  onDragEnd={ this.handleDragEnd }
                  onDrag={ this.handleDrag }
                  onClick={ this.handleClick }
                  shiftX={ -activeImage * this.sliderHeight }
                >
                    { children }
                </Draggable>
                <button
                  block="SliderVertical"
                  elem="ButtonDown"
                  mods={ { isArrowDownHidden } }
                  onClick={ this.onArrowDownClick }
                >
                    <div block="SliderVertical" elem="ArrowDown" />
                </button>
                { showCrumbs && this.renderCrumbs() }
            </div>
        );
    }
}

export default SliderVertical;
