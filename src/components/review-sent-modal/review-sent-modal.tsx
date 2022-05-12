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
    <>
      <div className="visually-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <symbol id="icon-success" viewBox="0 0 26 20">
            <path d="M9.32026 18.9812L0.964793 10.6727C0.916606 10.6247 0.878365 10.5678 0.852271 10.505C0.826177 10.4423 0.812744 10.375 0.812744 10.307C0.812744 10.2391 0.826177 10.1718 0.852271 10.109C0.878365 10.0463 0.916606 9.98932 0.964793 9.9414L3.07417 7.82969C3.27573 7.62812 3.60151 7.62812 3.80307 7.82969L9.30385 13.2977C9.50542 13.4992 9.83354 13.4969 10.0351 13.2953L22.1898 1.02344C22.3914 0.819531 22.7195 0.819531 22.9234 1.02109L25.0351 3.13281C25.2367 3.33437 25.2367 3.66016 25.0374 3.86172L11.7953 17.2234L11.7976 17.2258L10.0515 18.9812C9.84995 19.1828 9.52182 19.1828 9.32026 18.9812Z" fill="#C90606"/>
          </symbol>
        </svg>
      </div>
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
      </div>
    </>
  );
}

export default ReviewSentModal;
