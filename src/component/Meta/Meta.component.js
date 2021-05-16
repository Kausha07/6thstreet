import PropTypes from "prop-types";

import { Meta as SourceMeta } from "SourceComponent/Meta/Meta.component";

export class Meta extends SourceMeta {
  static propTypes = {
    ...SourceMeta.propTypes,
    hreflangs: PropTypes.arrayOf(
      PropTypes.shape({
        hreflang: PropTypes.string,
        href: PropTypes.string,
      })
    ).isRequired,
  };

  clearTitle() {
    const title = document.querySelectorAll("title");
    if (title && title.length) {
      title.forEach((tag) => tag.remove());
    }
  }

  clearDescription() {
    const description = document.querySelectorAll("[name=description]");
    if (description && description.length) {
      description.forEach((tag) => tag.remove());
    }
  }

  clearKeywords() {
    const keywords = document.querySelectorAll("[name=keywords]");
    if (keywords && keywords.length) {
      keywords.forEach((tag) => tag.remove());
    }
  }

  renderHreflang = ({ hreflang, href }, i) => (
    <link rel="alternate" hrefLang={hreflang} href={href} key={i} />
  );

  renderHreflangs() {
    const { hreflangs = [] } = this.props;

    if (!hreflangs.length) {
      return null;
    }

    return hreflangs.map(this.renderHreflang);
  }

  clearMetadata() {
    clearTitle();
    clearDescription();
    clearKeywords();
  }

  renderTitle() {
    const { default_title, title_prefix, title_suffix, title } = this.props;

    const titlePrefix = title_prefix ? `${title_prefix} | ` : "";
    const titleSuffix = title_suffix ? ` | ${title_suffix}` : "";

    const oldtitleTags = document.querySelectorAll("title");
    if (oldtitleTags && oldtitleTags.length) {
      oldtitleTags.forEach((tag) => tag.remove());
    }

    const newTitleTag = document.createElement("title");
    newTitleTag.innerHTML = `${titlePrefix}${
      title || default_title
    }${titleSuffix}`;
    document.head.appendChild(newTitleTag);
  }

  renderMeta() {
    const { metadata = [] } = this.props;
    return (
      <>
        {this.renderTitle()}
        {this.renderCanonical()}
        {this.renderHreflangs()}
        {metadata.map((tag) => {
          const tags = document.querySelectorAll(`[name=${tag.name}]`);
          if (tags && tags.length) {
            tags.forEach((tag) => tag.remove());
          }

          const newTag = document.createElement("meta");
          newTag.key = tag.name || tag.property;
          Object.keys(tag).map((key) => (newTag[key] = tag[key]));
          document.head.appendChild(newTag);
        })}
      </>
    );
  }
}

export default Meta;
