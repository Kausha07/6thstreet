import { PureComponent } from 'react';

import { isArabic } from 'Util/App';

import { CM_TO_INCH,
     UK_SIZE_CM,
     } from './SizeTable.config';

import {
    MENS_CLOTHING_SIZE,
    MENS_JEANS_SIZE,
    MENS_SHOES_SIZE
} from './MenSizeTable.config'
import {
    WOMENS_CLOTHING_SIZE,
     WOMENS_JEANS_SIZE,
     WOMENS_SHOES_SIZE,
} from './WomenSizeTable.config'

import {
    KIDS_CLOTHING_SIZE,
     KIDS_SHOES_SIZE,
     KIDS_ADULT_SHOES_SIZE
} from './KidsSizeTable.config'
import './SizeTable.style';

export class SizeTable extends PureComponent {
    constructor() {
        super();
        this.state = {
            isCm: true,
            isArabic: isArabic()
        };
    }

    handleClick = () => {
        const { isOpen } = this.state;
        this.setState({ isOpen: !isOpen });
    };

    renderTableRow = (row, i) => {
        const { size, bust, waist } = row;
        const { isCm } = this.state;

        if (isCm) {
            return (
                <tr key={ i }>
                    <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ size }</td>
                    <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                        { (bust * CM_TO_INCH).toFixed(2) }
                    </td>
                    <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                        { (waist * CM_TO_INCH).toFixed(2) }
                    </td>
                </tr>
            );
        }

        return (
            <tr>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ size }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ bust }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ waist }</td>
            </tr>
        );
    };

    renderMensClothing(){
        return(
            <>
            <h1 mix={ { block: 'SizeTable', elem: 'Title' } }>{__('MENS CLOTHING SIZE GUIDE')}</h1>
            
            <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'LongCell' } }>{ __('International') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('S') }</td>
                            <td colspan="2" mix={ { block: 'SizeTable', elem: 'TableMergeCellTop' } }>{ __('M') }</td>
                            <td colspan="2" mix={ { block: 'SizeTable', elem: 'TableMergeCellTop' } }>{ __('L') }</td>
                            <td colspan="2" mix={ { block: 'SizeTable', elem: 'TableMergeCellTop' } }>{ __('XL') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderMensClothingRows() }
                    </tbody>
                    </table>
                    </>
        )
    }
    renderMensClothingRows(){
        const rows = MENS_CLOTHING_SIZE.map(this.renderMensClothingRow);
        return rows;
    }
    renderMensClothingRow(row,i){
        const {international,s,m,l,xl} = row;
        return (
            <tr key={ i }>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ international }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { s }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { m[0] }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { m[1] }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { l[0] }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { l[1] }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    {xl[0] }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { xl[1] }
                </td>
            </tr>
        );

    }
    renderMensShoes(){
        return(
            <>
            <h1 mix={ { block: 'SizeTable', elem: 'Title' } }>{__('MEN’S SHOES SIZE GUIDE')}</h1>
            <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('EU') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('US') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('UK') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderMensShoesRows() }
                    </tbody>
                    </table>
            </>
        )
    }

    renderMensShoesRow(row,i){
        const {EU,US,UK,} = row;
        return (
            <tr key={ i }>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ EU }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { US }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { UK }
                </td>
                
            </tr>
        );

    }

    renderMensShoesRows(){
        const rows = MENS_SHOES_SIZE.map(this.renderMensShoesRow);
        return rows;
    }
    renderMensJeans(){
        return(
            <>
            <h1 mix={ { block: 'SizeTable', elem: 'Title' } }>{__('MEN’S JEANS SIZE GUIDE')}</h1>
            <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('JEANS') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('WAIST (CM)') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('WAIST (INCH)') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderMensJeansRows() }
                    </tbody>
                    </table>
            </>
        )
    }


    renderMensJeansRow(row,i){
        const {JEANS,WAIST_CM,WAIST_INCH,} = row;

        return (
            <tr key={ i }>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ JEANS }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { WAIST_CM }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { WAIST_INCH }
                </td>
                
            </tr>
        );
    }

    renderMensJeansRows(){
        const rows = MENS_JEANS_SIZE.map(this.renderMensJeansRow);
        return rows;
    }



    renderWomensClothing(){
        return(
            <>
            <h1 mix={ { block: 'SizeTable', elem: 'Title' } }>{__('WOMENS CLOTHING SIZE GUIDE')}</h1>
            <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'LongCell' } }>{ __('International') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('UK') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('EU') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('US') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Chest (CM)') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('West (CM)') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Hip (CM)') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.rendeWomensClothingRows() }
                    </tbody>
                    </table>
                    </>
        )
    }

    rendeWomensClothingRow(row,i){
        const {international,UK,EU,US,Chest,Waist,Hip} = row;
        return (
            <tr key={ i }>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ international }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { UK }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { EU }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { US }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { Chest}
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { Waist }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    {Hip}
                </td>
               
            </tr>
        );
    }

    rendeWomensClothingRows(){
        const rows = WOMENS_CLOTHING_SIZE.map(this.rendeWomensClothingRow);
        return rows;
    }


    renderWomensJeans(){
        return(
            <>
            <h1 mix={ { block: 'SizeTable', elem: 'Title' } }>{__('WOMEN’S JEANS SIZE GUIDE')}</h1>
            <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('JEANS') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('WAIST (Cm)') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Waist (Inch)') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderWomensJeansRows() }
                    </tbody>
                    </table>
                    </>
        )
    }


    renderWomensJeansRow(row,i){
        const {JEANS,WAIST_CM,WAIST_INCH} = row;
        return (
            <tr key={ i }>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ JEANS }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { WAIST_CM }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { WAIST_INCH }
                </td>              
            </tr>
        );
    }
    renderWomensJeansRows(){
        const rows = WOMENS_JEANS_SIZE.map(this.renderWomensJeansRow);
        return rows;
    }

    renderWomensShoes(){
        return(
            <>
            <h1 mix={ { block: 'SizeTable', elem: 'Title' } }>{__('WOMEN’S SHOES SIZE GUIDE')}</h1>
            <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('EU') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('US') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('UK') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderWomensShoesRows() }
                    </tbody>
                    </table>
            </>
        )
    }

    renderWomensShoesRow(row,i){
        const {EU,US,UK,} = row;
        return (
            <tr key={ i }>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ EU }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { US }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { UK }
                </td>
                
            </tr>
        );

    }

    renderWomensShoesRows(){
        const rows = WOMENS_SHOES_SIZE.map(this.renderWomensShoesRow);
        return rows;
    }


    renderKidsClothing(){
        return(
            <>
            <h1 mix={ { block: 'SizeTable', elem: 'Title' } }>{__('KIDS CLOTHING SIZE GUIDE')}</h1>
            <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'LongCell' } }>{ __('International Sizes') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Height (in)') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Height (cm)') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Weight (lb)') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Weight (kg)') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderKidsClothingRows() }
                    </tbody>
                    </table>
            </>
        )
    }

    renderInnerRow(row,i){
        const {type,HEIGHT_CM,HEIGHT_INCH,WEIGHT_LB,WEIGHT_KG} = row;
        return (
            <tr key={ i }>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ type }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { HEIGHT_CM }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { HEIGHT_INCH }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { WEIGHT_LB }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { WEIGHT_KG }
                </td>
            </tr>
        );
     }
    renderInnerRows(data){
        // console.log(data);
        const rows = data.map(this.renderInnerRow)
        return rows;
    }

    check(){
        console.log('check');
    }
    renderKidsClothingRow = (row,i)=>{
        const {type,data} = row;
        const innerRows = this.renderInnerRows(data)

        return (
            <>
            <tr key={ i }>
                <td colSpan="5" mix={ { block: 'SizeTable', elem: 'TableCellHeading' } }>{ type }</td>
            </tr>
            {innerRows}
            </>
        );
    }
    renderKidsClothingRows(){
        const rows = KIDS_CLOTHING_SIZE.map(this.renderKidsClothingRow);
        return rows;
    }

    renderKidsShoes(){
        return(
            <>
            <h1 mix={ { block: 'SizeTable', elem: 'Title' } }>{__('KIDS SHOES SIZE GUIDE')}</h1>
            <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('EU') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('US') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('UK') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderKidsShoesRows() }
                    </tbody>
                    </table>
            </>
        )
    }

    renderKidsShoesRow(row,i){
        const {EU,US,UK,} = row;
        return (
            <tr key={ i }>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ EU }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { US }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { UK }
                </td>
                
            </tr>
        );

    }

    renderKidsShoesRows(){
        const rows = KIDS_SHOES_SIZE.map(this.renderKidsShoesRow);
        return rows;
    }


    renderKidsAdultShoes(){
        return(
            <>
            <h1 mix={ { block: 'SizeTable', elem: 'Title' } }>{__('ADULT SIZES')}</h1>
            <table mix={ { block: 'SizeTable', elem: 'Table' } }>
                <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('EU') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('US') }</td>
                            <td  mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('UK') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderKidsAdultShoesRows() }
                    </tbody>
                    </table>
            </>
        )
    }

    renderKidsAdultShoesRow(row,i){
        const {EU,US,UK,} = row;
        return (
            <tr key={ i }>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>{ EU }</td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { US }
                </td>
                <td mix={ { block: 'SizeTable', elem: 'TableCell' } }>
                    { UK }
                </td>
            </tr>
        );

    }

    renderKidsAdultShoesRows(){
        const rows = KIDS_ADULT_SHOES_SIZE.map(this.renderKidsShoesRow);
        return rows;
    }
    renderTableRows() {
        const rows = UK_SIZE_CM.map(this.renderTableRow);
        return rows;
    }

    SwitchToCm = () => {
        this.setState({ isCm: true });
    };

    SwitchToInch = () => {
        this.setState({ isCm: false });
    };

    renderTable(){
        if(this.props.currentContentGender == 'men'){
            return (
                <>
                {this.renderMensClothing()}
                {this.renderMensShoes()}
                {this.renderMensJeans()}
                </>
            )
        }else if(this.props.currentContentGender == 'women'){
            return (
                <>
                {this.renderWomensClothing()}
                {this.renderWomensJeans()}
                {this.renderWomensShoes()}
                </>
            )
        }else if(this.props.currentContentGender == 'kids'){
            return (
                <>
                  {this.renderKidsClothing()}
                  {this.renderKidsShoes()}
                  {this.renderKidsAdultShoes()}
                </>
            )
        }
       
    }

    render() {
        const { isCm, isArabic } = this.state;

        return (
            <div block="SizeTable" mods={ { isArabic } }>
                {/* <div mix={ { block: 'SizeTable', elem: 'ButtonContainer' } }>
                    <button
                      onClick={ this.SwitchToCm }
                      mix={ { block: 'SizeTable', elem: 'ButtonCm', mods: { isCm } } }
                    >
                        { __('Cm') }
                    </button>
                    <button
                      onClick={ this.SwitchToInch }
                      mix={ { block: 'SizeTable', elem: 'ButtonInch', mods: { isCm } } }
                    >
                        { __('Inches') }
                    </button>
                </div> */}

                {this.renderTable()}
                {/* <table mix={ { block: 'SizeTable', elem: 'Table' } }> */}
                    {/* <thead>
                        <tr mix={ { block: 'SizeTable', elem: 'TopRow' } }>
                            <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Size') }</td>
                            <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Bust') }</td>
                            <td mix={ { block: 'SizeTable', elem: 'TableCellTop' } }>{ __('Waist') }</td>
                        </tr>
                    </thead>
                    <tbody>
                        { this.renderTableRows() }
                    </tbody> */}
                    
                {/* </table> */}
            </div>
        );
    }
}

export default SizeTable;
