// eslint-disable-next-line import/prefer-default-export
export const groupByName = (brands) => (
    brands.reduce((acc, brand) => {
        const { name } = brand;
        const firstLetter = name[0];

        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }

        acc[firstLetter].push(brand);
        return acc;
    }, {})
);
