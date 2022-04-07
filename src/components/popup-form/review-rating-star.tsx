type ReviewRatingStarProps = {
  rating: number,
  setRating: (evt: React.ChangeEvent<HTMLInputElement>, rating: number) => void,
}

function ReviewRatingStar(props: ReviewRatingStarProps): JSX.Element {
  const {rating, setRating} = props;
  return (
    <>
      <input
        className="visually-hidden" type="radio" name="rate" value={rating}
        id={`star-${rating}`}
        onChange={(evt) => {setRating(evt, rating);}}
      />
      <label className="rate__label" htmlFor={`star-${rating}`} title="Отлично"></label>
    </>
  );
}

export default ReviewRatingStar;
