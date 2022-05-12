import { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { State } from '../../types/state';
import { useState, useRef, useEffect} from 'react';
import useComponentVisible from '../../hooks/useComponentVisible';
import { useNavigate } from 'react-router';

const mapStateToProps = ({guitars, productsQuantityInCart}: State) => ({
  guitars,
  productsQuantityInCart,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function Header({guitars, productsQuantityInCart}: ConnectedComponentProps): JSX.Element {
  const [searchList, setSearchList] = useState(['']);
  const searchTab = useRef<HTMLInputElement>(null);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(true);
  const navigate = useNavigate();
  let productsQuantity = 0;
  productsQuantityInCart.forEach((item) => productsQuantity += item[1]);

  const handleSearchFieldChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    evt.preventDefault();
    setIsComponentVisible(true);
    const similarGuitars = guitars.slice().map((guitar) => guitar.name.toLowerCase().indexOf(evt.target.value.toLowerCase()) === -1 ? '' : guitar.name).filter((name) => name !== '');
    setSearchList(similarGuitars);
  };

  useEffect(() => {
    if(searchTab.current?.value === '' && searchList !== ['']) {setSearchList(['']);}
  }, [searchTab.current?.value]);

  const handleGuitarOptionClick = (evt: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    evt.preventDefault();
    if(searchTab.current !== null) {searchTab.current.value = '';}
    setSearchList(['']);
    const searchedGuitarName = evt.currentTarget.innerText;
    const searchedGuitarId = guitars.find((guitar) => guitar.name === searchedGuitarName)?.id;
    navigate(`/guitars/${searchedGuitarId}`);
  };

  return (
    <>
      <div className="visually-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
          <symbol id="icon-basket" viewBox="0 0 14 14">
            <path d="M13.8657 4.67725C13.8151 4.6074 13.7524 4.55132 13.6818 4.51287C13.6113 4.47442 13.5345 4.45451 13.4568 4.45452H10.2286V1.90908C10.2286 1.40276 10.0585 0.917179 9.75585 0.559157C9.45315 0.201135 9.0426 0 8.61452 0H5.38636C4.95828 0 4.54773 0.201135 4.24503 0.559157C3.94233 0.917179 3.77228 1.40276 3.77228 1.90908V4.45452H0.544119C0.46613 4.45347 0.388881 4.4725 0.317725 4.51027C0.246569 4.54804 0.183207 4.60366 0.132029 4.67327C0.0808507 4.74288 0.0430804 4.82482 0.0213348 4.91341C-0.000410723 5.00201 -0.00561161 5.09513 0.00609251 5.18633L1.01758 12.9181C1.05649 13.2216 1.18683 13.4982 1.38457 13.697C1.58231 13.8958 1.83413 14.0034 2.09364 13.9999H11.918C12.1775 14.0034 12.4293 13.8958 12.6271 13.697C12.8248 13.4982 12.9551 13.2216 12.9941 12.9181L13.9948 5.18633C14.0056 5.09548 13.9996 5.00295 13.9773 4.91508C13.955 4.82721 13.9169 4.74608 13.8657 4.67725ZM4.84833 1.90908C4.84833 1.74031 4.90502 1.57845 5.00592 1.45911C5.10682 1.33976 5.24366 1.27272 5.38636 1.27272H8.61452C8.75721 1.27272 8.89406 1.33976 8.99496 1.45911C9.09586 1.57845 9.15254 1.74031 9.15254 1.90908V4.45452H4.84833V1.90908ZM11.918 12.7272H2.08288L1.17361 5.72724H12.8273L11.918 12.7272Z" fill="currentcolor"/>
          </symbol>
          <symbol id="icon-search" viewBox="0 0 14 15">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.0276 9.52893L13.7934 13.2948C13.9257 13.4273 14.0001 13.6069 14 13.7942C13.9999 13.9814 13.9255 14.161 13.793 14.2934C13.6606 14.4257 13.481 14.5001 13.2937 14.5C13.1064 14.4999 12.9269 14.4255 12.7945 14.293L9.0287 10.5271C7.90295 11.3991 6.48731 11.8094 5.06977 11.6746C3.65223 11.5399 2.33927 10.8701 1.39799 9.80165C0.456712 8.73318 -0.0421836 7.34624 0.0027973 5.92299C0.0477782 4.49973 0.633257 3.14707 1.64013 2.14017C2.647 1.13327 3.99963 0.547779 5.42285 0.502797C6.84607 0.457815 8.23297 0.956724 9.30142 1.89803C10.3699 2.83933 11.0396 4.15233 11.1743 5.5699C11.3091 6.98748 10.8988 8.40315 10.0269 9.52893H10.0276ZM5.60026 10.2996C6.71412 10.2996 7.78235 9.85712 8.56997 9.06948C9.35759 8.28185 9.80007 7.21358 9.80007 6.0997C9.80007 4.98581 9.35759 3.91755 8.56997 3.12992C7.78235 2.34228 6.71412 1.89979 5.60026 1.89979C4.4864 1.89979 3.41817 2.34228 2.63055 3.12992C1.84293 3.91755 1.40046 4.98581 1.40046 6.0997C1.40046 7.21358 1.84293 8.28185 2.63055 9.06948C3.41817 9.85712 4.4864 10.2996 5.60026 10.2996Z" fill="currentcolor"/>
          </symbol>
        </svg>
      </div>
      <header className="header" id="header">
        <div className="container header__wrapper">
          <Link className="header__logo logo" to="/">
            <img className="logo__img" width="70" height="70" src="../img/svg/logo.svg" alt="Логотип" />
          </Link>
          <nav className="main-nav">
            <ul className="main-nav__list">
              <li>
                <Link className="link main-nav__link" to="/" >Каталог</Link>
              </li>
              <li>
                <a className="link main-nav__link" href="#">Где купить?</a>
              </li>
              <li>
                <a className="link main-nav__link" href="#">О компании</a>
              </li>
            </ul>
          </nav>
          <div className="form-search" style={{zIndex: '1000'}} ref={ref}>
            <form className="form-search__form">
              <button className="form-search__submit" type="submit">
                <svg className="form-search__icon" width="14" height="15" aria-hidden="true">
                  <use xlinkHref="#icon-search"></use>
                </svg><span className="visually-hidden">Начать поиск</span>
              </button>
              <input className="form-search__input" id="search" type="text" autoComplete="off" placeholder="что вы ищите?" ref={searchTab} onChange={(evt) => handleSearchFieldChange(evt)}></input>
              <label className="visually-hidden" htmlFor="search">Поиск</label>
            </form>
            {isComponentVisible &&
              <ul className={searchList[0] === '' ? 'form-search__select-list hidden' : 'form-search__select-list'}>
                {searchList.map((guitar) =>(
                  <li key={guitar} className="form-search__select-item" tabIndex={0} style={{display: 'block', position: 'relative', zIndex: '1000', width: '100%'}} onClick={(evt) => handleGuitarOptionClick(evt)}>
                    {guitar}
                  </li>))}
              </ul>}
          </div>
          <Link className="header__cart-link" to="/cart" aria-label="Корзина">
            <svg className="header__cart-icon" width="14" height="14" aria-hidden="true">
              <use xlinkHref="#icon-basket"></use>
            </svg>
            <span className="visually-hidden">Перейти в корзину</span>
            {productsQuantity !== 0 && <span className="header__cart-count">{productsQuantity}</span>}
          </Link>
        </div>
      </header>
    </>
  );
}

export {Header};
export default connector(Header);
