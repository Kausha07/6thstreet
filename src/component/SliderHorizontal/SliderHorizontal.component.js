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
} from './SliderHorizontal.config';

import './SliderHorizontal.style';

/**
 * Slider component
 * @class Slider
 */
export class SliderHorizontal extends PureComponent {
    static propTypes = {
        showCrumbs: PropTypes.bool,
        activeImage: PropTypes.number,
        onActiveImageChange: PropTypes.func,
        mix: MixType,
        children: ChildrenType.isRequired,
        isInteractionDisabled: PropTypes.bool,
        isZoomEnabled: PropTypes.bool.isRequired
    };

    static defaultProps = {
        activeImage: 0,
        onActiveImageChange: () => {},
        showCrumbs: false,
        isInteractionDisabled: false,
        mix: {}
    };

    sliderWidth = 0;

    prevPosition = 0;

    draggableRef = createRef();

    sliderRef = createRef();

    handleDragStart = this.handleInteraction.bind(this, this.handleDragStart);

    handleDrag = this.handleInteraction.bind(this, this.handleDrag);

    handleDragEnd = this.handleInteraction.bind(this, this.handleDragEnd);

    renderCrumb = this.renderCrumb.bind(this);

    isSlider = this.isSlider.bind(this);

    constructor(props) {
        super(props);

        const { activeImage } = this.props;

        this.state = {
            draggableRef: null,
            prevActiveImage: activeImage,
            width: 0,
            sliderChildren: null,
            sliderWidthChildren: null,
            sliderWidth: null,
            count: 0,
            countPerPage: 0,
            isArrowUpHidden: true,
            isArrowDownHidden: false,
            isSlider: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { activeImage } = props;
        const {
            prevActiveImage,
            sliderChildren,
            isSlider
        } = state;

        if (!isSlider) {
            return {
                isArrowUpHidden: true,
                isArrowDownHidden: true
            };
        }

        if (prevActiveImage !== activeImage) {
            return {
                prevActiveImage: activeImage,
                isArrowUpHidden: activeImage === 0,
                isArrowDownHidden: activeImage === sliderChildren.length - 1
            };
        }

        return {
            isArrowUpHidden: activeImage === 0,
            isArrowDownHidden: activeImage === sliderChildren.length - 1
        };
    }

    componentDidMount() {
        const { draggableRef, sliderRef } = this;
        const sliderChildren = draggableRef.current.children;
        const sliderWidthChildren = draggableRef.current.children[0].offsetWidth;
        const sliderWidth = sliderRef.current.offsetWidth;
        // eslint-disable-next-line no-magic-numbers
        const countPerPage = sliderWidth % sliderWidthChildren > 85
            ? Math.round(sliderWidth / sliderWidthChildren)
            : Math.floor(sliderWidth / sliderWidthChildren);

        this.setState({
            draggableRef,
            sliderChildren,
            sliderWidthChildren,
            sliderWidth,
            countPerPage,
            count: countPerPage
        });

        if (!sliderChildren || !sliderChildren[0]) {
            return;
        }

        sliderChildren[0].onload = () => {
            CSS.setVariable(this.sliderRef, 'slider-height', `${sliderChildren[0].offsetWidth}px`);
        };

        setTimeout(() => {
            CSS.setVariable(this.sliderRef, 'slider-height', `${sliderChildren[0].offsetWidth}px`);
        }, ANIMATION_DURATION);
    }

    componentDidUpdate(prevProps) {
        const { activeImage } = this.props;
        const { activeImage: prevActiveImage } = prevProps;

        const {
            draggableRef,
            sliderChildren,
            sliderWidthChildren,
            count,
            countPerPage,
            isSlider
        } = this.state;

        console.log(sliderWidthChildren,
            count,
            countPerPage);

        if (isSlider) {
            if (activeImage > prevActiveImage) {
                this.handleSliderDown(
                    activeImage,
                    count,
                    sliderChildren,
                    countPerPage,
                    sliderWidthChildren,
                    draggableRef,
                    prevActiveImage
                );
            }

            if (activeImage < prevActiveImage) {
                this.handleSliderUp(
                    activeImage,
                    count,
                    countPerPage,
                    sliderWidthChildren,
                    draggableRef,
                    prevActiveImage
                );
            }
        }
    }

    handleSliderDown = (
        activeImage,
        count,
        sliderChildren,
        countPerPage,
        sliderWidthChildren,
        draggableRef,
        prevActiveImage
    ) => {
        if (activeImage === count) {
            const newTranslate = sliderChildren.length / count < 2
                ? -(sliderChildren.length - countPerPage) * sliderWidthChildren
                : -((countPerPage - 1) * sliderWidthChildren);

            CSS.setVariable(
                draggableRef,
                'animation-speed',
                `${ Math.abs((prevActiveImage - activeImage) * ANIMATION_DURATION) }ms`
            );

            CSS.setVariable(
                draggableRef,
                'translateX',
                `${newTranslate}px`
            );

            if (activeImage === sliderChildren.length - 1) {
                this.setState({
                    prevActiveImage: activeImage,
                    count: sliderChildren.length + 1,
                    isArrowDownHidden: activeImage === sliderChildren.length - 1
                });
            }

            this.setState({
                prevActiveImage: activeImage,
                count: count + countPerPage - 1,
                isArrowDownHidden: activeImage === sliderChildren.length - 1
            });
        }
    };

    handleSliderUp = (
        activeImage,
        count,
        countPerPage,
        sliderWidthChildren,
        draggableRef,
        prevActiveImage
    ) => {
        if (activeImage === count - countPerPage - 1) {
            const newTranslate = count / countPerPage > 2
                ? -(countPerPage - 1) * sliderWidthChildren
                : 0;

            CSS.setVariable(
                draggableRef,
                'animation-speed',
                `${ Math.abs((prevActiveImage - activeImage) * ANIMATION_DURATION) }ms`
            );

            CSS.setVariable(
                draggableRef,
                'translateX',
                `${newTranslate}px`
            );

            if (newTranslate === 0) {
                this.setState({
                    prevActiveImage: activeImage,
                    count: countPerPage,
                    isArrowUpHidden: activeImage === 0
                });
            }

            this.setState({
                prevActiveImage: activeImage,
                count: count - countPerPage + 1,
                isArrowUpHidden: activeImage === 0
            });
        }
    };

    isSlider() {
        const { children, isZoomEnabled } = this.props;
        const { countPerPage } = this.state;

        console.log(isZoomEnabled);

        if (!isZoomEnabled) {
            this.setState({ isSlider: countPerPage < children.length });
        } else {
            console.log('here');
            this.setState({ isSlider: false });
        }
    }

    onArrowUpClick = () => {
        const { onActiveImageChange, activeImage } = this.props;
        onActiveImageChange(activeImage - 1);
    };

    onArrowDownClick = () => {
        const { onActiveImageChange, activeImage } = this.props;
        onActiveImageChange(activeImage + 1);
    };

    getFullSliderWidth() {
        const fullSliderWidth = this.draggableRef.current.scrollWidth;
        return fullSliderWidth - this.sliderWidth;
    }

    calculateNextSlide(state) {
        const {
            translateX: translate,
            lastTranslateX: lastTranslate,
            isSlider
        } = state;

        if (isSlider) {
            const { onActiveImageChange } = this.props;

            const slideSize = this.sliderWidth;

            const fullSliderSize = this.getFullSliderWidth();

            const activeSlidePosition = translate / slideSize;
            const activeSlidePercent = Math.abs(activeSlidePosition % 1);
            const isSlideBack = translate > lastTranslate;

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

        return null;
    }

    handleDragStart() {
        CSS.setVariable(this.draggableRef, 'animation-speed', '0');
    }

    handleDrag(state) {
        const { translateX, isSlider } = state;

        if (isSlider) {
            const translate = translateX;

            const fullSliderSize = this.getFullSliderWidth();

            if (translate < 0 && translate > -fullSliderSize) {
                CSS.setVariable(
                    this.draggableRef,
                    'translateX',
                    `${translate}px`
                );
            }
        }
    }

    handleDragEnd(state, callback) {
        const activeSlide = this.calculateNextSlide(state);

        const slideSize = this.sliderWidth;

        const newTranslate = activeSlide * slideSize;

        CSS.setVariable(this.draggableRef, 'animation-speed', '300ms');

        CSS.setVariable(
            this.draggableRef,
            'translateX',
            `${newTranslate}px`
        );

        callback({
            originalX: newTranslate,
            lastTranslateX: newTranslate
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
              block="SliderHorizontal"
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
              block="SliderHorizontal"
              elem="Image"
              mods={ { type: 'single' } }
              // eslint-disable-next-line react/jsx-no-bind
              onClick={ () => this.changeActiveImage(i) }
            >
                <div
                  block="SliderHorizontal"
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

        this.isSlider();

        return (
            <div
              block="SliderHorizontal"
              mix={ mix }
              ref={ this.sliderRef }
            >
                <button
                  block="SliderHorizontal"
                  elem="ButtonUp"
                  mods={ { isArrowUpHidden } }
                  onClick={ this.onArrowUpClick }
                >
                    <div block="SliderHorizontal" elem="ArrowUp" />
                </button>
                <Draggable
                  mix={ { block: 'SliderHorizontal', elem: 'Wrapper' } }
                  draggableRef={ this.draggableRef }
                  onDragStart={ this.handleDragStart }
                  onDragEnd={ this.handleDragEnd }
                  onDrag={ this.handleDrag }
                  onClick={ this.handleClick }
                  shiftX={ -activeImage * this.sliderWidth }
                >
                    { children }
                </Draggable>
                <button
                  block="SliderHorizontal"
                  elem="ButtonDown"
                  mods={ { isArrowDownHidden } }
                  onClick={ this.onArrowDownClick }
                >
                    <div block="SliderHorizontal" elem="ArrowDown" />
                </button>
                { showCrumbs && this.renderCrumbs() }
            </div>
        );
    }
}

export default SliderHorizontal;
