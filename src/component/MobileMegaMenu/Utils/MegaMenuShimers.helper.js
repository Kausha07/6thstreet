export const renderBannerAnimationShimper = () => (
  <div block="AnimationWrapper"></div>
);

export const renderMegaMenuAnimationShimer = (
  wrapperBlock = "Wrapper",
  elementBlock = "Card",
  count = 4
) => {
  const cardCount = count ? count : 4;
  const cards = Array.from({ length: cardCount }, (_, index) => (
    <div key={index} block={wrapperBlock} elem={elementBlock}></div>
  ));

  return <div block={wrapperBlock}>{cards}</div>;
};
