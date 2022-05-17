import Header from '../header/header';
import Footer from '../footer/footer';
import ProductInCart from '../product-in-cart/product-in-cart';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../types/state';
import { Link } from 'react-router-dom';
import { MouseEvent, useState, useRef, useEffect } from 'react';
import ModalCartDelete from '../modal-cart-delete/modal-cart-delete';
import { Guitar } from '../../types/guitar';
import { fetchCouponPostAction } from '../../store/api-actions';
import { ThunkAppDispatch } from '../../types/action';
import { store } from '../../store/store';
import useComponentVisible from '../../hooks/useComponentVisible';

const mapStateToProps = ({productsInCart, productsQuantityInCart, couponValue}: State) => ({
  productsInCart,
  productsQuantityInCart,
  couponValue,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function CartPage({productsInCart, productsQuantityInCart, couponValue}: ConnectedComponentProps):JSX.Element {
  const [isModalProductDeleteVisible, setIsModalProductDeleteVisible] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Guitar>(productsInCart[0]);
  const couponRef = useRef(null);
  let totalValueBeforeDiscount = 0;
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [couponAccepted, setCouponAccepted] = useState<boolean>(false);
  const [couponRejected, setCouponRejected] = useState<boolean>(false);
  const { refCartDelete, isComponentVisible, setIsComponentVisible } = useComponentVisible(true);

  productsQuantityInCart.forEach((item) => {
    const totalPerProduct = item[1] * productsInCart.filter((product) => product.id === item[0])[0].price;
    totalValueBeforeDiscount += totalPerProduct;
  });

  window.scrollTo(0, 0);

  useEffect(() => {
    if(typeof couponValue === 'number' && couponValue !== 0) {
      setCouponAccepted(true);
      setCouponRejected(false);
      setDiscountValue(totalValueBeforeDiscount * couponValue / 100);
    } else if(couponValue !== 0) {
      setCouponRejected(true);
      setCouponAccepted(false);
    }
  }, [couponValue]);

  const orderValue = totalValueBeforeDiscount - discountValue;

  useEffect(() => {
    const body = document.querySelector('body');
    if(body !== null){
      body.style.overflow = (isModalProductDeleteVisible && isComponentVisible) ? 'hidden' : 'auto';
    }
  }, [isModalProductDeleteVisible, isComponentVisible]);

  const handleCouponInput = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const coupon = {'coupon': ''};
    if(couponRef.current) {
      coupon['coupon'] = couponRef.current['value'];
    }
    (store.dispatch as ThunkAppDispatch)(fetchCouponPostAction(coupon));
  };

  return (
    <>
      <div className="wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <h1 className="title title--bigger page-content__title">Корзина</h1>
            <ul className="breadcrumbs page-content__breadcrumbs page-content__breadcrumbs--on-cart-page">
              <li className="breadcrumbs__item"><Link className="link" to="/">Главная</Link>
              </li>
              <li className="breadcrumbs__item"><Link className="link" to="/">Каталог</Link>
              </li>
              <li className="breadcrumbs__item"><a className="link">Корзина</a>
              </li>
            </ul>
            <div className="cart">
              {productsInCart?.slice().map((product) => (
                <ProductInCart key={product.id} product={product} setIsModalProductDeleteVisible={setIsModalProductDeleteVisible} setIsComponentVisible={setIsComponentVisible} setProductToDelete={setProductToDelete}/>
              ))}
              <div className="cart__footer">
                <div className="cart__coupon coupon">
                  <h2 className="title title--little coupon__title">Промокод на скидку</h2>
                  <p className="coupon__info">Введите свой промокод, если он у вас есть.</p>
                  <form className="coupon__form" id="coupon-form" method="post" action="/">
                    <div className="form-input coupon__input">
                      <label className="visually-hidden">Промокод</label>
                      {!couponAccepted && !couponRejected && <input ref={couponRef} type="text" placeholder="Введите промокод" id="couponWithoutText" name="coupon"></input>}
                      {(couponAccepted || couponRejected) &&
                      <input ref={couponRef} type="text" placeholder="Введите промокод"
                        id={couponAccepted && !couponRejected ? 'coupon' : 'couponError'}
                        name="coupon"
                      >
                      </input>}
                      {couponAccepted && <p className="form-input__message form-input__message--success">Промокод принят</p>}
                      {couponRejected && <p className="form-input__message form-input__message--error">неверный промокод</p>}
                    </div>
                    <button className="button button--big coupon__button" onClick={handleCouponInput}>Применить</button>
                  </form>
                </div>
                <div className="cart__total-info">
                  <p className="cart__total-item"><span className="cart__total-value-name">Всего:</span><span className="cart__total-value">{totalValueBeforeDiscount.toLocaleString()} ₽</span></p>
                  <p className="cart__total-item"><span className="cart__total-value-name">Скидка:</span><span className={`cart__total-value ${discountValue !== 0 ? 'cart__total-value--bonus' : ''}`}>- {discountValue.toLocaleString()} ₽</span></p>
                  <p className="cart__total-item"><span className="cart__total-value-name">К оплате:</span><span className="cart__total-value cart__total-value--payment">{orderValue.toLocaleString()} ₽</span></p>
                  <button className="button button--red button--big cart__order-button">Оформить заказ</button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
      {isComponentVisible && isModalProductDeleteVisible && <ModalCartDelete refCartDelete={refCartDelete} productToDelete={productToDelete} setIsComponentVisible={setIsComponentVisible} setIsModalProductDeleteVisible={setIsModalProductDeleteVisible}/>}
    </>
  );
}

export {CartPage};
export default connector(CartPage);
