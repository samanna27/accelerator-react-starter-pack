import { useNavigate } from 'react-router';
import { Dispatch, SetStateAction } from 'react';
import { Guitar } from '../../types/guitar';
import { GUITAR_TYPE_SINGLE } from '../../const';
import { deleteProductFromCart } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../store/store';

type ModalCartDeleteProps = {
  productToDelete: Guitar
  setIsModalProductDeleteVisible: Dispatch<SetStateAction<boolean>>,
};

function ModalCartDelete({productToDelete, setIsModalProductDeleteVisible}: ModalCartDeleteProps):JSX.Element {
  const {name, vendorCode, previewImg, stringCount, type, price} = productToDelete;
  const imageAddress = `img/content${previewImg.substring(previewImg.indexOf('/'))}`;
  const navigate = useNavigate();

  const handleGoToCatalogClick = () => {
    navigate('/');
    setIsModalProductDeleteVisible(false);
  };

  const handleClosePopupClick = () => {
    setIsModalProductDeleteVisible(false);
  };

  const handleProductDeletion = () => {
    (store.dispatch as ThunkAppDispatch)(deleteProductFromCart(productToDelete));
  };

  return (
    <div style={{position: 'relative', width: '550px', height: '440px', marginBottom: '50px'}}>
      <div className="modal is-active modal-for-ui-kit">
        <div className="modal__wrapper">
          <div className="modal__overlay" data-close-modal></div>
          <div className="modal__content">
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
              <button className="button button--small modal__button" onClick={handleProductDeletion}>Удалить товар</button>
              <button className="button button--black-border button--small modal__button modal__button--right" onClick={handleGoToCatalogClick}>Продолжить покупки</button>
            </div>
            <button className="modal__close-btn button-cross" type="button" aria-label="Закрыть" onClick={handleClosePopupClick}>
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
