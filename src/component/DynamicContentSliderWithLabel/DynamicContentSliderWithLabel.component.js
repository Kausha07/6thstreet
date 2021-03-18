import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import TinySlider from 'tiny-slider-react';
import Image from 'Component/Image';
import Link from 'Component/Link';
import { formatCDNLink } from 'Util/Url';
import DynamicContentHeader from '../DynamicContentHeader/DynamicContentHeader.component'
import './DynamicContentSliderWithLabel.style';

class DynamicContentSliderWithLabel extends PureComponent {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                url: PropTypes.string,
                label: PropTypes.string,
                link: PropTypes.string,
                plp_config: PropTypes.shape({}) // TODO: describe
            })
        ).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            settings: {
                lazyload: true,
                nav: false,
                mouseDrag: true,
                touch: true,
                controlsText: ["&#10094", "&#10095"],
                gutter: 8,
                loop: false,
                responsive: {
                    1024:{
                        items: 5,
                        gutter: 25
                    },
                    420: {
                        items: 5
                    },
                    300: {
                        items: 2
                    }
                }
            },
        };
    }

    componentDidMount(){
        if(this.props.items.length < 8){
            let setting = JSON.parse(JSON.stringify(this.state.settings))
            setting.responsive[1024].items = this.props.items.length
            this.setState(prevState => ({
                ...prevState,
                settings: {
                    ...prevState.settings,
                    responsive: {
                        ...prevState.settings.responsive,
                        1024: {
                           ...prevState.settings.responsive[1024],
                           items: this.props.items.length
                        }
                    }
                }
            }))
        }
    }

    renderCircle = (item, i) => {
        const {
            link,
            text,
            url,
            plp_config,
            height,
            width
        } = item;

        const linkTo = {
            pathname: formatCDNLink(link),
            state: { plp_config }
        };
        let wd;
        if(this.state.settings.responsive[300].items === 1){
            wd = (screen.width - 16).toString()  + "px";
        }
        else{
            wd = width.toString() + "px";
        }
        let ht = height.toString() + "px";


        // TODO: move to new component

        return (
            <div block="SliderWithLabel" key={i*10}>

                <Link
                  to={ linkTo }
                  key={ i*10 }
                  onClick={ () => {
                      this.clickLink(item);
                  } }
                >
                <img src={ url } alt={ text } block= 'Image'/>

                </Link>
                <div block="CircleSliderLabel" style={{width: wd}}>{ text }</div>
            </div>
        );
    };

    renderCircles() {
        const { items = [] } = this.props;
        let { settings } = this.state;
        if(items[0] && items[0].height === 300 && items[0].width === 300) {
        settings.responsive[300] = 1;
 }
        return (
            <TinySlider settings={ this.state.settings } block="SliderWithLabelWrapper">
                { items.map(this.renderCircle) }
            </TinySlider>
        );
    }

    render() {
        return (
            <div block="DynamicContentSliderWithLabel">
                {this.props.header &&
                    <DynamicContentHeader header={this.props.header}/>
                }
                {this.props.title &&
                    <h1 block="Title">{this.props.title}</h1>
                }
                { this.renderCircles() }
            </div>
        );
    }
}

export default DynamicContentSliderWithLabel;
