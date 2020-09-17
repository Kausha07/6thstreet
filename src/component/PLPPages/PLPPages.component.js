// import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import PLPPage from 'Component/PLPPage';
import { Pages } from 'Util/API/endpoint/Product/Product.type';

import './PLPPages.style';

class PLPPages extends PureComponent {
    static propTypes = {
        pages: Pages.isRequired
    };

    renderPage = ([key, page]) => (
        <PLPPage
          key={ key }
          page={ page }
        />
    );

    renderPages() {
        const { pages } = this.props;

        return pages ? Object.entries(pages).map(this.renderPage) : null;
    }

    render() {
        return (
            <div block="PLPPages">
                { this.renderPages() }
            </div>
        );
    }
}

export default PLPPages;
