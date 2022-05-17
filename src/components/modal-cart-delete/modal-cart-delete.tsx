import { useNavigate } from 'react-router';
import { Dispatch, MutableRefObject, SetStateAction, useRef, KeyboardEvent } from 'react';
import { Guitar } from '../../types/guitar';
import { GUITAR_TYPE_SINGLE, KEYCODE_TAB } from '../../const';
import { deleteProductFromCart } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../store/store';

type ModalCartDeleteProps = {
  refCartDelete: MutableRefObject<HTMLDivElement | null>,
  productToDelete: Guitar
  setIsModalProductDeleteVisible: Dispatch<SetStateAction<boolean>>,
  setIsComponentVisible: Dispatch<SetStateAction<boolean>>,
};

function ModalCartDelete({refCartDelete, productToDelete, setIsModalProductDeleteVisible, setIsComponentVisible}: ModalCartDeleteProps):JSX.Element {
  const {name, vendorCode, previewImg, stringCount, type, price} = productToDelete;
  const imageAddress = `img/content${previewImg.substring(previewImg.indexOf('/'))}`;
  const navigate = useNavigate();
  const deleteFromCartRef = useRef<HTMLButtonElement>(null);
  const closeModalRef = useRef<HTMLButtonElement>(null);

  const handleGoToCatalogClick = () => {
    navigate('/cart');
    setIsModalProductDeleteVisible(false);
  };

  const handleClosePopupClick = () => {
    setIsModalProductDeleteVisible(false);
    setIsComponentVisible(false);
  };

  const handleProductDeletion = () => {
    (store.dispatch as ThunkAppDispatch)(deleteProductFromCart(productToDelete));
    setIsModalProductDeleteVisible(false);
  };

  const handleInputKeydown = (evt: KeyboardEvent<HTMLElement>) => {
    const isTabPressed = (evt.key === 'Tab' || evt.keyCode === KEYCODE_TAB);

    if (!isTabPressed) {
      return;
    }

    if ( evt.shiftKey ) /* shift + tab */ {
      if (document.activeElement === deleteFromCartRef.current) {
        closeModalRef.current?.focus();
        evt.preventDefault();
      }
    } else /* tab */ {
      if (document.activeElement === closeModalRef.current) {
        deleteFromCartRef.current?.focus();
        evt.preventDefault();
      }
    }
  };

  return (
    <div style={{position: 'relative', width: '550px', height: '440px', marginBottom: '50px'}}>
      <div className="modal is-active modal-for-ui-kit">
        <div className="modal__wrapper">
          <div className="modal__overlay" data-close-modal></div>
          <div ref={refCartDelete} className="modal__content">
            <h2 className="modal__header title title--medium title--red">Удалить этот товар?</h2>
            <div className="modal__info">
              <img className="modal__img" src={imageAddress} width="67" height="137" alt="Честер bass" />
              <div className="modal__info-wrapper">
                <h3 className="modal__product-name title title--little title--uppercase">Гитара {name}</h3>
                <p className="modal__product-params modal__product-params--margin-11">Артикул: {vendorCode}</p>
                <p className="modal__product-params">{GUITAR_TYPE_SINGLE[type]}, {stringCount} струнная</p>
                <p className="modal__price-wrapper"><span className="modal__price">Цена:</span><span className="modal__price">{price.toLocaleString()} ₽</span></p>
              </div>
            </div>
            <div className="modal__button-container">
              <button ref={deleteFromCartRef} autoFocus tabIndex={1} className="button button--small modal__button" onClick={handleProductDeletion} onKeyDown={handleInputKeydown}>Удалить товар</button>
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
  );
}

export default ModalCartDelete;
