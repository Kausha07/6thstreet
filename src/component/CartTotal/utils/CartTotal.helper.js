export const getValueFromTotals = (totalSegments, totalsCode) => {
    const { value } = totalSegments.find(({ code }) => code === totalsCode) || { value: 0 };

    return value;
};
