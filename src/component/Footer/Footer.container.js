import { connect } from 'react-redux';

import Footer from './Footer.component';

export const mapStateToProps = (state) => ({
    copyright: state.ConfigReducer.copyright
});

export default connect(mapStateToProps)(Footer);
