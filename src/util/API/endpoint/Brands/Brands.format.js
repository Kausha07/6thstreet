// eslint-disable-next-line import/prefer-default-export
export const groupByName = (brands = []) => {
    const numericGroup = '0-9';

    return brands.reduce((acc, brand) => {
        const { name } = brand;
        const firstLetter = !Number.isNaN(+name[0]) ? numericGroup : name[0].toUpperCase();

        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }

        acc[firstLetter].push(brand);
        return acc;
    }, {});
};
