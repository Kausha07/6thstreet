import Html from 'Component/Html';
import { CmsPage as SourceCmsPage } from 'SourceRoute/CmsPage/CmsPage.component';

export class CmsPage extends SourceCmsPage {
    renderContent() {
        const {
            isLoading,
            page: { content }
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

        return (
            <Html content={ result } />
        );
    }
}
export default CmsPage;
