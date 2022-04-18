import { KeyboardEvent} from 'react';

type ReviewRatingStarProps = {
  rating: number,
  setRating: (evt: React.ChangeEvent<HTMLInputElement>, rating: number) => void,
  ref: React.RefObject<HTMLInputElement>,
  onKeyDown: (evt: KeyboardEvent<HTMLInputElement>) => void;
}

function ReviewRatingStar(props: ReviewRatingStarProps): JSX.Element {
  const {rating, setRating, ref, onKeyDown} = props;
  return (
    <>
      <input
        className="visually-hidden" type="radio" name="rate" value={rating}
        id={`star-${rating}`}
        onChange={(evt) => {
          setRating(evt, rating);
        }}
        onKeyDown={onKeyDown}
        ref={ref}
      />
      <label className="rate__label" htmlFor={`star-${rating}`} title="Отлично"></label>
    </>
  );
}

export default ReviewRatingStar;
