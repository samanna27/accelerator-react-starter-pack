import { Dispatch, MutableRefObject, SetStateAction, useRef, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { KEYCODE_TAB } from '../../const';

type ModalSuccessAddProps = {
  setIsModalSuccessAddVisible: Dispatch<SetStateAction<boolean>>;
  setIsComponentVisible: Dispatch<SetStateAction<boolean>>;
  refCartAddSuccess: MutableRefObject<HTMLDivElement | null>;
};

function ModalSuccessAdd({setIsModalSuccessAddVisible, setIsComponentVisible, refCartAddSuccess}: ModalSuccessAddProps):JSX.Element {
  const navigate = useNavigate();
  const goToCartRef = useRef<HTMLButtonElement>(null);
  const closeModalRef = useRef<HTMLButtonElement>(null);

  const handleGoToCartClick = () => {
    navigate('/cart');
  };

  const handleGoToCatalogClick = () => {
    navigate('/');
    setIsModalSuccessAddVisible(false);
  };

  const handleClosePopupClick = () => {
    setIsModalSuccessAddVisible(false);
    setIsComponentVisible(false);
  };

  const handleInputKeydown = (evt: KeyboardEvent<HTMLElement>) => {
    const isTabPressed = (evt.key === 'Tab' || evt.keyCode === KEYCODE_TAB);

    if (!isTabPressed) {
      return;
    }

    if ( evt.shiftKey ) /* shift + tab */ {
      if (document.activeElement === goToCartRef.current) {
        closeModalRef.current?.focus();
        evt.preventDefault();
      }
    } else /* tab */ {
      if (document.activeElement === closeModalRef.current) {
        goToCartRef.current?.focus();
        evt.preventDefault();
      }
    }
  };

  return  (
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
            <div ref={refCartAddSuccess} className="modal__content">
              <svg className="modal__icon" width="26" height="20" aria-hidden="true">
                <use xlinkHref="#icon-success"></use>
              </svg>
              <p className="modal__message">Товар успешно добавлен в корзину</p>
              <div className="modal__button-container modal__button-container--add">
                <button ref={goToCartRef} autoFocus tabIndex={1} className="button button--small modal__button" onClick={handleGoToCartClick} onKeyDown={handleInputKeydown}>Перейти в корзину</button>
                <button tabIndex={2} className="button button--black-border button--small modal__button modal__button--right" onClick={handleGoToCatalogClick}>Продолжить покупки</button>
              </div>
              <button ref={closeModalRef} tabIndex={3} className="modal__close-btn button-cross" type="button" aria-label="Закрыть" onClick={handleClosePopupClick} onKeyDown={handleInputKeydown}>
                <span className="button-cross__icon"></span>
                <span className="modal__close-btn-interactive-area"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalSuccessAdd;

