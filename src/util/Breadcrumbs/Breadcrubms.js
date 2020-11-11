/* eslint-disable fp/no-let */
// eslint-disable-next-line import/prefer-default-export
export const getBreadcrumbs = (data, onClick, urlArray) => data.reduce((acc, categoryLevel, idx) => {
    let firstPart = '';
    let secondPart = '';

    // eslint-disable-next-line no-unused-vars
    const url = data.reduce((acc, item) => {
        const itemToUrl = item.replace('&', '')
            .replace(/(\s+)|--/g, '-')
            .replace('@', 'at')
            .toLowerCase();

        firstPart += `/${itemToUrl }`;
        secondPart += item === data[0] ? `${itemToUrl }` : `+${itemToUrl }`;

        acc.push(`${firstPart }.html?q=${secondPart }`);

        return acc;
    }, []);

    const transformedCategory = categoryLevel.replace(/-/g, ' ');

    acc.push({
        url: idx !== 0 ? urlArray[idx] : '/',
        name: transformedCategory,
        onClick: idx === 0 ? onClick : () => {}
    });

    return acc;
}, []);

// eslint-disable-next-line max-len
export const getBreadcrumbsUrl = (categoriesLastLevel, menuCategories) => menuCategories.reduce((acc, category) => {
    if (category.label === categoriesLastLevel[1]) {
        const currentCategory = category.data[category.data.length - 1];
        acc.push('/', currentCategory.button.link);

        const mappedCategoryFirstLevel = currentCategory.items
            .reduce((acc, categoryFirst) => {
                if (categoryFirst.label === categoriesLastLevel[2]) {
                    acc.push(categoryFirst.link);
                }

                return acc;
            }, []);

        acc.push(mappedCategoryFirstLevel.length === 1
            ? mappedCategoryFirstLevel[0]
            : currentCategory.button.link);
    }

    return acc;
}, []);
