import { Guitar } from '../../types/guitar';
import { GUITAR_TYPE_SINGLE } from '../../const';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../types/state';
import { ChangeEvent, FocusEvent, MouseEvent, useState, useRef, useEffect, Dispatch, SetStateAction} from 'react';
import { addProductToCart } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../store/store';

type ProductInCartProps = {
  product: Guitar,
  setIsModalProductDeleteVisible: Dispatch<SetStateAction<boolean>>,
  setIsComponentVisible: Dispatch<SetStateAction<boolean>>,
  setProductToDelete: Dispatch<SetStateAction<Guitar>>,
};

const mapStateToProps = ({productsQuantityInCart}: State) => ({
  productsQuantityInCart,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux & ProductInCartProps;


function ProductInCart({product, productsQuantityInCart, setIsModalProductDeleteVisible, setIsComponentVisible, setProductToDelete}: ConnectedComponentProps): JSX.Element {
  const {name, vendorCode, stringCount, price, previewImg, type} = product;
  const imageAddress = `img/content${previewImg.substring(previewImg.indexOf('/'))}`;
  const [productQuantity, setProductQuantity] = useState<number>(productsQuantityInCart.filter((item) => item[0] === product.id)[0][1]);
  const quantityRef = useRef<HTMLInputElement>(null);
  const totalPerProduct = price * Math.max(1, Math.min(99, productQuantity));

  const handleQuantityBlur = (evt: FocusEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const value = Math.max(1, Math.min(99, Number(evt.target.value)));

    if(quantityRef.current !== null && Number(quantityRef.current.value) > 99 && quantityRef.current.value !== '0')  {
      quantityRef.current.value = '99';
    } else if (quantityRef.current !== null && (quantityRef.current.value === '0' || Number(quantityRef.current.value) < 0)) {
      quantityRef.current.value = '1';
    }

    setProductQuantity(value);
  };

  const handleQuantityChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();

    const value = evt.target.value;

    if (+evt.target.value < 1) {
      evt.target.setCustomValidity('Количество не может быть меньше 1 или больше 99.');
    } else if(+evt.target.value > 99) {
      evt.target.setCustomValidity('Количество не может быть меньше 1 или больше 99.');
    } else {
      evt.target.setCustomValidity('');
    }

    setProductQuantity(+value);
    (store.dispatch as ThunkAppDispatch)(addProductToCart(product, +value));

    evt.target.reportValidity();
  };

  const handleQuantityChangeByOne = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if(evt.currentTarget.ariaLabel === 'Уменьшить количество' && productQuantity-1 > 0) {
      setProductQuantity(productQuantity-1);
      (store.dispatch as ThunkAppDispatch)(addProductToCart(product, productQuantity-1));
    } else if(evt.currentTarget.ariaLabel === 'Уменьшить количество') {
      setProductToDelete({...product});
      setIsModalProductDeleteVisible(true);
    }

    if(evt.currentTarget.ariaLabel === 'Увеличить количество' && productQuantity+1 <= 99) {
      setProductQuantity(productQuantity+1);
      (store.dispatch as ThunkAppDispatch)(addProductToCart(product, productQuantity+1));
    } else if(evt.currentTarget.ariaLabel === 'Увеличить количество'){
      evt.currentTarget.setCustomValidity('Количество не может быть меньше 1 или больше 99.');
      evt.currentTarget.reportValidity();
    }

  };

  useEffect(() => {
    if(quantityRef.current !== null) {
      quantityRef.current.value = `${productQuantity}`;
    }
  },[productQuantity]);

  const handleProductDeletionClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    setProductToDelete({...product});
    setIsModalProductDeleteVisible(true);
    setIsComponentVisible(true);
  };

  return (
    <>
      <div className="visually-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <symbol id="icon-minus" viewBox="0 0 9 1">
            <line x1="8.58536" y1="0.5" x2="0.780479" y2="0.5" stroke="currentcolor"/>
          </symbol>
          <symbol id="icon-plus" viewBox="0 0 9 8">
            <line x1="8.2439" y1="4.11829" x2="0.439018" y2="4.11829" stroke="currentcolor"/>
            <line x1="4.1785" y1="8" x2="4.1785" stroke="currentcolor"/>
          </symbol>
        </svg>
      </div>
      <div className="cart-item">
        <button className="cart-item__close-button button-cross" type="button" aria-label="Удалить" onClick={handleProductDeletionClick}>
          <span className="button-cross__icon"></span>
          <span className="cart-item__close-button-interactive-area"></span>
        </button>
        <div className="cart-item__image">
          <img src={imageAddress} width="55" height="130" alt={`${type} ${name}`} />
        </div>
        <div className="product-info cart-item__info">
          <p className="product-info__title">{GUITAR_TYPE_SINGLE[type]} {name}</p>
          <p className="product-info__info">Артикул: {vendorCode}</p>
          <p className="product-info__info">{GUITAR_TYPE_SINGLE[type]}, {stringCount} струнная</p>
        </div>
        <div className="cart-item__price">{price.toLocaleString('ru-RU')} ₽</div>
        <div className="quantity cart-item__quantity">
          <button className="quantity__button" aria-label="Уменьшить количество" onClick={handleQuantityChangeByOne}>
            <svg width="8" height="8" aria-hidden="true">
              <use xlinkHref="#icon-minus"></use>
            </svg>
          </button>
          <input className="quantity__input" type="number" placeholder="1" id="2-count" name="2-count" max="99"
            ref={quantityRef}
            onChange={handleQuantityChange}
            onBlur={(evt) => handleQuantityBlur(evt)}
            defaultValue={productQuantity}
          />
          <button className="quantity__button" aria-label="Увеличить количество" onClick={handleQuantityChangeByOne}>
            <svg width="8" height="8" aria-hidden="true">
              <use xlinkHref="#icon-plus"></use>
            </svg>
          </button>
        </div>
        <div className="cart-item__price-total">{totalPerProduct.toLocaleString()} ₽</div>
      </div>
    </>

  );
}

export {ProductInCart};
export default connector(ProductInCart);
