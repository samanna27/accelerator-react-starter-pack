import { ChangeEvent, MouseEvent, KeyboardEvent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { State } from '../../types/state';
import { useState, useRef, useEffect} from 'react';
import { AppRoute } from '../../const';
import {redirectToRoute} from '../../store/action';
import {ThunkAppDispatch} from '../../types/action';
import {store} from '../../index';

const mapStateToProps = ({guitars}: State) => ({
  guitars,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function Header({guitars}: ConnectedComponentProps): JSX.Element {
  const [searchList, setSearchList] = useState(['']);
  const searchTab = useRef<HTMLInputElement>(null);

  const handleSearchFieldChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const similarGuitars = guitars.slice().map((guitar) => guitar.name.indexOf(evt.target.value) === -1 ? '' : guitar.name).filter((name) => name !== '');
    setSearchList(similarGuitars);
  };

  useEffect(()=> {
    if(searchTab.current?.value === '' && searchList !== ['']) {setSearchList(['']);}
  }, [searchTab.current?.value]);

  const handleGuitarOptionClick = (evt: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    evt.preventDefault();
    if(searchTab.current !== null) {searchTab.current.value = '';}
    setSearchList(['']);
    //eslint-disable-next-line
    console.log('we are in click handler');
    // const searchedGuitarName = evt.currentTarget.innerText;
    // const searchedGuitarId = guitars.find((guitar) => guitar.name === searchedGuitarName)?.id;
    (store.dispatch as ThunkAppDispatch)(redirectToRoute(AppRoute.Guitar));
  };

  return (
    <header className="header" id="header">
      <div className="container header__wrapper">
        <a className="header__logo logo">
          <img className="logo__img" width="70" height="70" src="./img/svg/logo.svg" alt="Логотип" />
        </a>
        <nav className="main-nav">
          <ul className="main-nav__list">
            <li><a className="link main-nav__link link--current" href="#">Каталог</a>
            </li>
            <li><a className="link main-nav__link" href="#">Где купить?</a>
            </li>
            <li><a className="link main-nav__link" href="#">О компании</a>
            </li>
          </ul>
        </nav>
        <div className="form-search" style={{zIndex: '1000'}}>
          <form className="form-search__form">
            <button className="form-search__submit" type="submit">
              <svg className="form-search__icon" width="14" height="15" aria-hidden="true">
                <use xlinkHref="#icon-search"></use>
              </svg><span className="visually-hidden">Начать поиск</span>
            </button>
            <input className="form-search__input" id="search" type="text" autoComplete="off" placeholder="что вы ищите?" ref={searchTab} onChange={(evt) => handleSearchFieldChange(evt)}></input>
            <label className="visually-hidden" htmlFor="search">Поиск</label>
          </form>
          <ul className={searchList[0] === '' ? 'form-search__select-list hidden' : 'form-search__select-list'}>
            {searchList.map((guitar) =>(
              <li key={guitar} className="form-search__select-item" tabIndex={0} style={{display: 'block', position: 'relative', zIndex: '1000', width: '100%'}} onClick={(evt) => handleGuitarOptionClick(evt)}>
                {guitar}
              </li>))}
          </ul>
        </div>
        <a className="header__cart-link" href="#" aria-label="Корзина">
          <svg className="header__cart-icon" width="14" height="14" aria-hidden="true">
            <use xlinkHref="#icon-basket"></use>
          </svg><span className="visually-hidden">Перейти в корзину</span><span className="header__cart-count">2</span>
        </a>
      </div>
    </header>
  );
}

export {Header};
export default connector(Header);
