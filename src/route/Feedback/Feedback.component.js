/**
 * @category  sixth-street
 * @author    Vladislavs Belavskis <info@scandiweb.com>
 * @license   http://opensource.org/licenses/OSL-3.0 The Open Software License 3.0 (OSL-3.0)
 * @copyright Copyright (c) 2020 Scandiweb, Inc (https://scandiweb.com)
 */

 import PropTypes from 'prop-types';
 import { PureComponent } from 'react';
 import { connect } from 'react-redux';
 import Field from 'Component/Field';
 import Form from 'Component/Form';

 import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
 import { changeNavigationState } from 'Store/Navigation/Navigation.action';
 import { DEFAULT_STATE_NAME } from 'Component/NavigationAbstract/NavigationAbstract.config';
 import ContentWrapper from 'Component/ContentWrapper';

 export const BreadcrumbsDispatcher = import(
    'Store/Breadcrumbs/Breadcrumbs.dispatcher'
);

 export const mapStateToProps = (state) => ({
     headerState: state.NavigationReducer[TOP_NAVIGATION_TYPE].navigationState,
 });
 export const mapDispatchToProps = (dispatch) => ({
    changeHeaderState: (state) => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    updateBreadcrumbs: (breadcrumbs) => BreadcrumbsDispatcher.then(
        ({ default: dispatcher }) => dispatcher.update(breadcrumbs, dispatch)
    ),
});
 
 export class Feedback extends PureComponent {
   static propTypes = {
       updateBreadcrumbs: PropTypes.func.isRequired,
       changeHeaderState: PropTypes.func.isRequired
   };
 
   componentDidMount() {
       this.updateBreadcrumbs();
       this.updateHeaderState();
   }
 
   updateHeaderState() {
       const { changeHeaderState } = this.props;
 
       changeHeaderState({
           name: DEFAULT_STATE_NAME,
           isHiddenOnMobile: true
       });
   }
 
   updateBreadcrumbs() {
       const { updateBreadcrumbs } = this.props;
       const breadcrumbs = [
           {
               url: '/feedback',
               name: __('Feedback')
           },
           {
               url: '/',
               name: __('Home')
           }
       ];
 
       updateBreadcrumbs(breadcrumbs);
   }
 
   render() {
       return (
         <main block="Feedback" aria-label={ __('Feedback Form') }>
           <ContentWrapper
             mix={ { block: 'Feedback' } }
             wrapperMix={ {
                 block: 'Feedback',
                 elem: 'Wrapper'
             } }
             label={ __('Feedback') }
           >
               <Form>
                    <fieldset block="Feedback-form" elem="Legend">
                        <Field
                          type="text"
                          placeholder={ __('FIRST NAME*') }
                          id="firstname"
                          name="firstname"
                          autocomplete="given-name"
                          validation={ ['notEmpty'] }
                        />
                        <Field
                          type="text"
                          placeholder={ __('LAST NAME*') }
                          id="lastname"
                          name="lastname"
                          autocomplete="family-name"
                          validation={ ['notEmpty'] }
                        />
                    </fieldset>
                    <Field
                      type="text"
                      placeholder={ __('EMAIL*') }
                      id="email"
                      name="email"
                      autocomplete="email"
                      validation={ ['notEmpty', 'email'] }
                    />
                    <Field
                      type="PHONE_TYPE"
                      placeholder="Phone Number"
                      pattern="[0-9]*"
                      name="number"
                      id="number"
                    />
               </Form>
           </ContentWrapper>
         </main>
       );
   }
 }

 
 export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
 