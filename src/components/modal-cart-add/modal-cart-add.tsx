import { Dispatch, SetStateAction } from 'react';
import { addProductToCart } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../store/store';
import { Guitar } from '../../types/guitar';

type ModalCartAddProps = {
  product: Guitar;
  setIsModalCartAddVisible: Dispatch<SetStateAction<boolean>>;
  setIsModalSuccessAddVisible: Dispatch<SetStateAction<boolean>>;
};

function ModalCartAdd({product, setIsModalCartAddVisible, setIsModalSuccessAddVisible}: ModalCartAddProps): JSX.Element {
  const {name, vendorCode, stringCount, previewImg, price} = product;
  const imageAddress = `../img/content${previewImg.substring(previewImg.indexOf('/'))}`;

  const handleClosePopupClick = () => {
    setIsModalCartAddVisible(false);
  };

  const handleAddProductToCartClick = () => {
    (store.dispatch as ThunkAppDispatch)(addProductToCart(product));
    setIsModalCartAddVisible(false);
    setIsModalSuccessAddVisible(true);
  };

  return (
    <div style={{position: 'relative', width: '550px', height: '440px', marginBottom: '50px'}}>
      <div className="modal is-active modal-for-ui-kit">
        <div className="modal__wrapper">
          <div className="modal__overlay" data-close-modal></div>
          <div className="modal__content">
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
              <button className="button button--red button--big modal__button modal__button--add" onClick={handleAddProductToCartClick}>Добавить в корзину</button>
            </div>
            <button className="modal__close-btn button-cross" type="button" aria-label="Закрыть" onClick={handleClosePopupClick}><span className="button-cross__icon"></span><span className="modal__close-btn-interactive-area"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCartAdd;
