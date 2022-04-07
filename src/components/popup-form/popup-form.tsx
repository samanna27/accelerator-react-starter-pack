import { SetStateAction, Dispatch, MutableRefObject, ChangeEvent, useState, useRef, FormEvent } from 'react';
import { fetchPostReviewAction } from '../../store/api-actions';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../index';
import ReviewRatingStar from './review-rating-star';
import { CommentPost } from '../../types/guitar';
import {toast} from 'react-toastify';

const RATING_MESSAGE = 'Пожалуйста, оцените продукт';

type PopupFormProps = {
  setIsReviewPopupVisible: Dispatch<SetStateAction<boolean>>;
  setIsComponentVisible: Dispatch<SetStateAction<boolean>>;
  refPopup: MutableRefObject<HTMLParagraphElement | null>;
  guitarId: number;
  setIsReviewSentModalVisible: Dispatch<SetStateAction<boolean>>;
  guitarName: string;
}

function PopupForm({setIsReviewPopupVisible, setIsComponentVisible, refPopup, guitarId, setIsReviewSentModalVisible, guitarName}: PopupFormProps): JSX.Element {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const advantageRef = useRef<HTMLInputElement>(null);
  const disadvantageRef = useRef<HTMLInputElement>(null);
  const [rating, setRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [advantage, setAdvantage] = useState<string>('');
  const [disadvantage, setDisadvantage] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  let starRatingCount = 5;
  const stars =  new Array(5).fill('').map((index) => {
    index=starRatingCount;
    starRatingCount--;

    return index;
  });

  const handleInputAreaChange = (evt: ChangeEvent<HTMLInputElement>, ratingToSet: number) => {
    setRating(ratingToSet);
  };

  const handleTextareaChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(evt.target.value);

    if(evt.target.value === ''){
      evt.target.setCustomValidity('Поле не должно быть пустым');
    } else {
      evt.target.setCustomValidity('');
    }

    evt.target.reportValidity();
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if(nameRef.current === evt.currentTarget){
      setName(evt.target.value);
    }
    if(advantageRef.current === evt.currentTarget){
      setAdvantage(evt.target.value);
    }
    if(disadvantageRef.current === evt.currentTarget){
      setDisadvantage(evt.target.value);
    }

    if(evt.target.value === ''){
      evt.target.setCustomValidity('Поле не должно быть пустым');
    } else {
      evt.target.setCustomValidity('');
    }

    evt.target.reportValidity();
  };

  const isFormValid = name.length > 0 && newComment.length > 0 && advantage.length > 0 && disadvantage.length > 0 && rating !== 0;

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if(nameRef.current?.value === ''){
      nameRef.current.setCustomValidity('Пожалуйста, заполните поле');
    } else {
      nameRef.current?.setCustomValidity('');
    }
    nameRef.current?.reportValidity();

    if(advantageRef.current?.value === ''){
      advantageRef.current.setCustomValidity('Пожалуйста, заполните поле');
    } else {
      advantageRef.current?.setCustomValidity('');
    }
    advantageRef.current?.reportValidity();

    if(disadvantageRef.current?.value === ''){
      disadvantageRef.current.setCustomValidity('Пожалуйста, заполните поле');
    } else {
      disadvantageRef.current?.setCustomValidity('');
    }
    disadvantageRef.current?.reportValidity();

    if(textRef.current?.value === ''){
      textRef.current.setCustomValidity('Пожалуйста, заполните поле');
    } else {
      textRef.current?.setCustomValidity('');
    }
    textRef.current?.reportValidity();

    if(rating === 0){
      toast.info(RATING_MESSAGE);
    }

    if(isFormValid){
      const newReview: CommentPost = {
        guitarId: guitarId,
        userName: name,
        advantage: advantage,
        disadvantage: disadvantage,
        comment: newComment,
        rating: rating,
      };

      (store.dispatch as ThunkAppDispatch)(fetchPostReviewAction(newReview));
      setIsReviewPopupVisible(false);
      setIsReviewPopupVisible(false);
      setIsReviewSentModalVisible(true);
    }
  };

  const closePopup = () => {
    setIsReviewPopupVisible(false);
    setIsComponentVisible(false);
  };

  return (
    <p>
      <div style={{position: 'relative', width: '550px', height: '610px', marginBottom: '50px'}} >
        <div className="modal is-active modal--review modal-for-ui-kit">
          <div className="modal__wrapper">
            <div className="modal__overlay" data-close-modal></div>
            <div ref={refPopup} className="modal__content">
              <h2 className="modal__header modal__header--review title title--medium">Оставить отзыв</h2>
              <h3 className="modal__product-name title title--medium-20 title--uppercase">{guitarName}</h3>
              <form onSubmit={handleSubmit} className="form-review">
                <div className="form-review__wrapper">
                  <div className="form-review__name-wrapper">
                    <label className="form-review__label form-review__label--required" htmlFor="user-name">Ваше Имя</label>
                    <input ref={nameRef} className="form-review__input form-review__input--name" id="user-name" type="text" autoComplete="off" onChange={handleInputChange}/><span className="form-review__warning">Заполните поле</span>
                  </div>
                  <div><span className="form-review__label form-review__label--required">Ваша Оценка</span>
                    <div className="rate rate--reverse" >
                      {stars.map((star) => <ReviewRatingStar key={star} rating={star} setRating={handleInputAreaChange}/>)}
                      <span className="rate__count"></span><span className="rate__message">Поставьте оценку</span>
                    </div>
                  </div>
                </div>
                <label className="form-review__label" htmlFor="user-name">Достоинства</label>
                <input ref={advantageRef} className="form-review__input" id="pros" type="text" autoComplete="off" onChange={handleInputChange}/>
                <label className="form-review__label" htmlFor="user-name">Недостатки</label>
                <input ref={disadvantageRef} className="form-review__input" id="user-name" type="text" autoComplete="off" onChange={handleInputChange}/>
                <label className="form-review__label" htmlFor="user-name">Комментарий</label>
                <textarea ref={textRef} value={newComment} onChange={handleTextareaChange}
                  className="form-review__input form-review__input--textarea" id="user-name" rows={10} autoComplete="off"
                >
                </textarea>
                <button className="button button--medium-20 form-review__button" type="submit">Отправить отзыв</button>
              </form>
              <button className="modal__close-btn button-cross" type="button" aria-label="Закрыть" onClick={closePopup}><span className="button-cross__icon"></span><span className="modal__close-btn-interactive-area"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </p>
  );
}

export default PopupForm;
