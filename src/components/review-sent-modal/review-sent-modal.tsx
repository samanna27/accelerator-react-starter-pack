import { SetStateAction, Dispatch, MutableRefObject, MouseEvent } from 'react';

type ReviewSentModalProps = {
  setIsReviewSentModalVisible: Dispatch<SetStateAction<boolean>>;
  setIsReviewPopupVisible: Dispatch<SetStateAction<boolean>>;
  setIsComponentVisible: Dispatch<SetStateAction<boolean>>;
  refReviewSent: MutableRefObject<HTMLDivElement | null>;
  id: number;
};

function ReviewSentModal({setIsReviewPopupVisible, setIsReviewSentModalVisible, setIsComponentVisible, refReviewSent, id}: ReviewSentModalProps):JSX.Element {
  const handleBackToGuitarCardCliick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setIsReviewSentModalVisible(false);
  };

  const closePopup = () => {
    setIsReviewPopupVisible(false);
    setIsComponentVisible(false);
  };

  return (
    <div style={{position: 'relative', width: '550px', height: '410px', marginBottom: '50px'}}>
      <div className="modal is-active modal--success modal-for-ui-kit">
        <div className="modal__wrapper">
          <div className="modal__overlay" data-close-modal></div>
          <div ref={refReviewSent} className="modal__content">
            <svg className="modal__icon" width="26" height="20" aria-hidden="true">
              <use xlinkHref="#icon-success"></use>
            </svg>
            <p className="modal__message">Спасибо за ваш отзыв!</p>
            <div className="modal__button-container modal__button-container--review">
              <button className="button button--small modal__button modal__button--review" onClick={handleBackToGuitarCardCliick}>К покупкам!</button>
            </div>
            <button onClick={closePopup} className="modal__close-btn button-cross" type="button" aria-label="Закрыть"><span className="button-cross__icon"></span><span className="modal__close-btn-interactive-area"></span>
            </button>
          </div>
        </div>
      </div>
    </div>);
}

export default ReviewSentModal;
