
export const preloadImg = (url) => {
    var preloadLink = document.createElement("link");
    preloadLink.href = url;
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.id = "preload-img";
    document.head.appendChild(preloadLink);
}