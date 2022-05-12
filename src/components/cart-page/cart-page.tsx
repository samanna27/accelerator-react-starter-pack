import Header from '../header/header';
import Footer from '../footer/footer';
import ProductInCart from '../product-in-cart/product-in-cart';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../types/state';
import { Link } from 'react-router-dom';

const mapStateToProps = ({productsInCart}: State) => ({
  productsInCart,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function CartPage({productsInCart}: ConnectedComponentProps):JSX.Element {

  return (
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
              <ProductInCart key={product.id} product={product} />
            ))}
            <div className="cart__footer">
              <div className="cart__coupon coupon">
                <h2 className="title title--little coupon__title">Промокод на скидку</h2>
                <p className="coupon__info">Введите свой промокод, если он у вас есть.</p>
                <form className="coupon__form" id="coupon-form" method="post" action="/">
                  <div className="form-input coupon__input">
                    <label className="visually-hidden">Промокод</label>
                    <input type="text" placeholder="Введите промокод" id="coupon" name="coupon" />
                    <p className="form-input__message form-input__message--success">Промокод принят</p>
                  </div>
                  <button className="button button--big coupon__button">Применить</button>
                </form>
              </div>
              <div className="cart__total-info">
                <p className="cart__total-item"><span className="cart__total-value-name">Всего:</span><span className="cart__total-value">52 000 ₽</span></p>
                <p className="cart__total-item"><span className="cart__total-value-name">Скидка:</span><span className="cart__total-value cart__total-value--bonus">- 3000 ₽</span></p>
                <p className="cart__total-item"><span className="cart__total-value-name">К оплате:</span><span className="cart__total-value cart__total-value--payment">49 000 ₽</span></p>
                <button className="button button--red button--big cart__order-button">Оформить заказ</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export {CartPage};
export default connector(CartPage);
