export const isMsiteMegaMenuRoute = () => {
    if(window.location.pathname.includes("megamenu") || window.location.pathname.includes("brands-menu")) {
        return true;
    }
    return false;
}

export const isMsiteMegaMenuCategoriesRoute = () => {
    if(window.location.pathname.includes("megamenu")) {
        return true;
    }
    return false;
}

export const isMsiteMegaMenuBrandsRoute = () => {
    if(window.location.pathname.includes("brands-menu")) {
        return true;
    }
    return false;
}
