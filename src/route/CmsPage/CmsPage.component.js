import Html from 'Component/Html';
import { CmsPage as SourceCmsPage } from 'SourceRoute/CmsPage/CmsPage.component';

import './CmsPage.extended.style';

export class CmsPage extends SourceCmsPage {
    renderContent() {
        const {
            isLoading,
            page: { content },
            location: { pathname }
        } = this.props;

        if (isLoading) {
            return (
                <>
                    <div block="CmsPage" elem="SectionPlaceholder" />
                    <div block="CmsPage" elem="SectionPlaceholder" />
                    <div block="CmsPage" elem="SectionPlaceholder" />
                </>
            );
        }

        if (!isLoading && !content) {
            return null;
        }

        const tws = document.createElement('html');
        tws.innerHTML = content;

        const textChild = (tws.lastChild.firstChild.firstChild.firstChild);
        const result = String(textChild.innerHTML)
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        const cmsBlock = pathname.slice(1);

        return (
            <div block={ cmsBlock }>
                <Html content={ result } />
            </div>
        );
    }
}
export default CmsPage;
