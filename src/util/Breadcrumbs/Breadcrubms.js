/* eslint-disable fp/no-let */
// eslint-disable-next-line import/prefer-default-export
export const getBreadcrumbs = (data, onClick) => data.reduce((acc, categoryLevel, idx) => {
    let firstPart = '';
    let secondPart = '';

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
        url: idx !== 0 ? url[idx] : '/',
        name: transformedCategory,
        onClick: idx !== 0 ? onClick : () => {}
    });

    return acc;
}, []);
