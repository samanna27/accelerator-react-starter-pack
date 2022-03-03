const getWeightRatingDown = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortGuitarsPriceDown = (guitarA, guitarB) => {
  const weight = getWeightRatingDown(guitarA.price, guitarB.price);

  if (weight !== null) {
    return weight;
  }

  return (guitarB.price-guitarA.price);
};

export const sortGuitarsPriceUp = (guitarA, guitarB) => (guitarA.price-guitarB.price);
export const sortGuitarsRatingUp = (guitarA, guitarB) => (guitarA.rating-guitarB.rating);

export const sortGuitarsRatingDown = (guitarA, guitarB) => {
  const weight = getWeightRatingDown(guitarA.rating, guitarB.rating);

  if (weight !== null) {
    return weight;
  }

  return (guitarB.rating-guitarA.rating);
};
