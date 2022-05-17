import { SetStateAction, Dispatch, MutableRefObject, ChangeEvent, KeyboardEvent, MouseEvent, useState, useRef, FormEvent } from 'react';
import { fetchPostReviewAction } from '../../store/api-actions';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../store/store';
import { CommentPost } from '../../types/guitar';
import { KEYCODE_TAB } from '../../const';

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
  const lastFocusableElRef = useRef<HTMLButtonElement>(null);
  const fifthStarRef = useRef<HTMLInputElement>(null);
  const forthStarRef = useRef<HTMLInputElement>(null);
  const thirdStarRef = useRef<HTMLInputElement>(null);
  const secondStarRef = useRef<HTMLInputElement>(null);
  const firstStarRef = useRef<HTMLInputElement>(null);
  const [rating, setRating] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [advantage, setAdvantage] = useState<string>('');
  const [disadvantage, setDisadvantage] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');


  const handleInputKeydown = (evt: KeyboardEvent<HTMLElement>) => {
    const isTabPressed = (evt.key === 'Tab' || evt.keyCode === KEYCODE_TAB);

    if (!isTabPressed) {
      return;
    }

    if ( evt.shiftKey ) /* shift + tab */ {
      if (document.activeElement === nameRef.current) {
        lastFocusableElRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === fifthStarRef.current) {
        forthStarRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === forthStarRef.current) {
        thirdStarRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === thirdStarRef.current) {
        secondStarRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === secondStarRef.current) {
        firstStarRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === firstStarRef.current) {
        nameRef.current?.focus();
        evt.preventDefault();
      }
    } else /* tab */ {
      if (document.activeElement === lastFocusableElRef.current) {
        nameRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === nameRef.current) {
        firstStarRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === fifthStarRef.current) {
        advantageRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === forthStarRef.current) {
        fifthStarRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === thirdStarRef.current) {
        forthStarRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === secondStarRef.current) {
        thirdStarRef.current?.focus();
        evt.preventDefault();
      } else if (document.activeElement === firstStarRef.current) {
        secondStarRef.current?.focus();
        evt.preventDefault();
      }
    }
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

  const handleStarClick = (evt: MouseEvent<HTMLInputElement>) => {
    fifthStarRef.current?.setCustomValidity('');
    fifthStarRef.current?.reportValidity();
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

    if(!fifthStarRef.current?.checked && !forthStarRef.current?.checked && !thirdStarRef.current?.checked && !secondStarRef.current?.checked && !firstStarRef.current?.checked){
      fifthStarRef.current?.setCustomValidity('Пожалуйста, оцените продукт');
    } else {
      fifthStarRef.current?.setCustomValidity('');
    }
    fifthStarRef.current?.reportValidity();

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
                    <input autoFocus tabIndex={0}
                      ref={nameRef}
                      className="form-review__input form-review__input--name"
                      id="user-name"
                      type="text"
                      autoComplete="off"
                      onChange={handleInputChange}
                      onKeyDown={handleInputKeydown}
                    />
                    <span className="form-review__warning">Заполните поле</span>
                  </div>
                  <div><span className="form-review__label form-review__label--required">Ваша Оценка</span>
                    <div className="rate rate--reverse" >
                      <input
                        tabIndex={5}
                        className="visually-hidden" type="radio" name="rate" value={5}
                        id="star-5"
                        onChange={() => setRating(5)}
                        onKeyDown={handleInputKeydown}
                        onClick={handleStarClick}
                        ref={fifthStarRef}
                      />
                      <label className="rate__label" htmlFor="star-5" title="Отлично"></label>
                      <input
                        tabIndex={4}
                        className="visually-hidden" type="radio" name="rate" value={4}
                        id="star-4"
                        onChange={() =>setRating(4)}
                        onClick={handleStarClick}
                        onKeyDown={handleInputKeydown}
                        ref={forthStarRef}
                      />
                      <label className="rate__label" htmlFor="star-4" title="Хорошо"></label>
                      <input
                        tabIndex={3}
                        className="visually-hidden" type="radio" name="rate" value={3}
                        id="star-3"
                        onChange={() => setRating(3)}
                        onClick={handleStarClick}
                        onKeyDown={handleInputKeydown}
                        ref={thirdStarRef}
                      />
                      <label className="rate__label" htmlFor="star-3" title="Удовлетворительно"></label>
                      <input
                        tabIndex={2}
                        className="visually-hidden" type="radio" name="rate" value={2}
                        id="star-2"
                        onChange={() => setRating(2)}
                        onClick={handleStarClick}
                        onKeyDown={handleInputKeydown}
                        ref={secondStarRef}
                      />
                      <label className="rate__label" htmlFor="star-2" title="Неудовлетворительно"></label>
                      <input
                        tabIndex={1}
                        className="visually-hidden" type="radio" name="rate" value={1}
                        id="star-1"
                        onChange={() => setRating(1)}
                        onClick={handleStarClick}
                        onKeyDown={handleInputKeydown}
                        ref={firstStarRef}
                      />
                      <label className="rate__label" htmlFor="star-1" title="Плохо"></label>
                      <span className="rate__count"></span><span className="rate__message">Поставьте оценку</span>
                    </div>
                  </div>
                </div>
                <label className="form-review__label" htmlFor="user-name">Достоинства</label>
                <input tabIndex={6} ref={advantageRef} className="form-review__input" id="pros" type="text" autoComplete="off" onChange={handleInputChange}/>
                <label className="form-review__label" htmlFor="user-name">Недостатки</label>
                <input tabIndex={7} ref={disadvantageRef} className="form-review__input" id="user-name" type="text" autoComplete="off" onChange={handleInputChange}/>
                <label className="form-review__label" htmlFor="user-name">Комментарий</label>
                <textarea tabIndex={8} ref={textRef} value={newComment} onChange={handleTextareaChange}
                  className="form-review__input form-review__input--textarea" id="user-name" rows={10} autoComplete="off"
                >
                </textarea>
                <button tabIndex={9} className="button button--medium-20 form-review__button" type="submit">Отправить отзыв</button>
              </form>
              <button ref ={lastFocusableElRef}
                tabIndex={10}
                className="modal__close-btn button-cross"
                type="button"
                aria-label="Закрыть"
                onClick={closePopup}
                onKeyDown={handleInputKeydown}
              >
                <span className="button-cross__icon"></span>
                <span className="modal__close-btn-interactive-area"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </p>
  );
}

export default PopupForm;
