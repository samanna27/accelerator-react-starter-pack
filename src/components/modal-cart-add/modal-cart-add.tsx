import { Dispatch, SetStateAction, MutableRefObject, KeyboardEvent, useRef } from 'react';
import { addProductToCart } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../store/store';
import { Guitar } from '../../types/guitar';
import { KEYCODE_TAB } from '../../const';

type ModalCartAddProps = {
  product: Guitar;
  setIsModalCartAddVisible: Dispatch<SetStateAction<boolean>>;
  setIsComponentVisible: Dispatch<SetStateAction<boolean>>;
  setIsModalSuccessAddVisible: Dispatch<SetStateAction<boolean>>;
  refCartAdd: MutableRefObject<HTMLDivElement | null>;
};

function ModalCartAdd({product, setIsModalCartAddVisible, setIsComponentVisible, setIsModalSuccessAddVisible, refCartAdd}: ModalCartAddProps): JSX.Element {
  const {name, vendorCode, stringCount, previewImg, price} = product;
  const imageAddress = `../img/content${previewImg.substring(previewImg.indexOf('/'))}`;
  const addToCartRef = useRef<HTMLButtonElement>(null);
  const closeModalRef = useRef<HTMLButtonElement>(null);

  const handleClosePopupClick = () => {
    setIsModalCartAddVisible(false);
    setIsComponentVisible(false);
  };

  const handleAddProductToCartClick = () => {
    (store.dispatch as ThunkAppDispatch)(addProductToCart(product, 1));
    setIsModalCartAddVisible(false);
    setIsModalSuccessAddVisible(true);
  };

  const handleInputKeydown = (evt: KeyboardEvent<HTMLElement>) => {
    const isTabPressed = (evt.key === 'Tab' || evt.keyCode === KEYCODE_TAB);

    if (!isTabPressed) {
      return;
    }

    if ( evt.shiftKey ) /* shift + tab */ {
      if (document.activeElement === addToCartRef.current) {
        closeModalRef.current?.focus();
        evt.preventDefault();
      }
    } else /* tab */ {
      if (document.activeElement === closeModalRef.current) {
        addToCartRef.current?.focus();
        evt.preventDefault();
      }
    }
  };


  return (
    <div style={{position: 'relative', width: '550px', height: '440px', marginBottom: '50px'}}>
      <div className="modal is-active modal-for-ui-kit">
        <div className="modal__wrapper">
          <div className="modal__overlay" data-close-modal></div>
          <div ref={refCartAdd} className="modal__content">
            <h2 className="modal__header title title--medium">Добавить товар в корзину</h2>
            <div className="modal__info">
              <img className="modal__img" src={imageAddress} width="67" height="137" alt="Честер bass" />
              <div className="modal__info-wrapper">
                <h3 className="modal__product-name title title--little title--uppercase">Гитара {name}</h3>
                <p className="modal__product-params modal__product-params--margin-11">Артикул: {vendorCode}</p>
                <p className="modal__product-params">Электрогитара, {stringCount} струнная</p>
                <p className="modal__price-wrapper"><span className="modal__price">Цена:</span><span className="modal__price">{price.toLocaleString('ru-RU')} ₽</span></p>
              </div>
            </div>
            <div className="modal__button-container">
              <button ref={addToCartRef} autoFocus tabIndex={1} className="button button--red button--big modal__button modal__button--add" onClick={handleAddProductToCartClick} onKeyDown={handleInputKeydown}>Добавить в корзину</button>
            </div>
            <button ref={closeModalRef} tabIndex={2} className="modal__close-btn button-cross" type="button" aria-label="Закрыть" onClick={handleClosePopupClick} onKeyDown={handleInputKeydown}><span className="button-cross__icon"></span><span className="modal__close-btn-interactive-area"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCartAdd;
