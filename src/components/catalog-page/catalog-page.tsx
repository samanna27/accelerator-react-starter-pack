import Logo from '../logo/logo';
import { State } from '../../types/state';
import { Guitar } from '../../types/guitar';
import { connect, ConnectedProps } from 'react-redux';
import ProductCard from '../product-card/product-card';
import CatalogFilter from '../catalog-filter/catalog-filter';
import CatalogSort from '../catalog-sort/catalog-sort';
import Header from '../header/header';
import Footer from '../footer/footer';
import { sortGuitarsPriceDown, sortGuitarsRatingDown, sortGuitarsPriceUp, sortGuitarsRatingUp } from '../../utils/common';
import { CARDS_PER_PAGE, END_CARD_INDEX, GUITARS_TYPES_CHECKED, PAGENATION, START_CARD_INDEX, GUITAR_TYPE_CHECKED_FLAG, GUITAR_TYPE_CHECKED_INDEX } from '../../const';
import { useState, SyntheticEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { store } from '../../index';
import { updateCardsRendered } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import PreviousPage from './previous-page';
import NextPage from './next-page';
import { useHistory } from 'react-router-dom';

const mapStateToProps = ({guitars, sortType, orderType, minPriceFilter, maxPriceFilter, guitarType, stringsQuantity, cardsRendered}: State) => ({
  guitars,
  sortType,
  orderType,
  minPriceFilter,
  maxPriceFilter,
  guitarType,
  stringsQuantity,
  cardsRendered,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type ConnectedComponentProps = PropsFromRedux;

function CatalogPage({guitars, sortType, orderType, minPriceFilter, maxPriceFilter, guitarType, stringsQuantity, cardsRendered}: ConnectedComponentProps): JSX.Element {
  const [isActivePage, setIsActivePage] = useState<string>('');
  const [isPreviousPage, setIsPreviousPage] = useState<boolean>(false);
  const [isNextPage, setIsNextPage] = useState<boolean>(true);
  const [isDeactivateNextPage, setIsDeactivateNextPage] = useState<boolean>(false);
  const [isDeactivatePreviousPage, setIsDeactivatePreviousPage] = useState<boolean>(false);
  const [guitarsFromTo, setGuitarsFromTo] = useState<number[]>([0,CARDS_PER_PAGE]);
  const pageURL = `catalog/page_${Math.round((cardsRendered[START_CARD_INDEX]+1)/CARDS_PER_PAGE+1)}`;
  const history = useHistory();

  useEffect(() => {
    setIsActivePage('');
    setIsPreviousPage(false);
    setIsNextPage(true);
    setIsDeactivateNextPage(false);
    setIsDeactivatePreviousPage(false);

  }, [guitarType, stringsQuantity]);

  const getSortedGuitars = () => {
    switch (sortType) {
      case 'по цене':
        return guitars.slice().sort(sortGuitarsPriceUp);
      case 'по популярности':
        return guitars.slice().sort(sortGuitarsRatingUp);
      default:
        return guitars.slice();
    }
  };

  const getSortedAndOrderedGuitars = () => {
    switch (orderType) {
      case 'down':
        switch (sortType) {
          case 'по цене':
          case '':
            return guitars.slice().sort(sortGuitarsPriceDown);
          case 'по популярности':
            return guitars.slice().sort(sortGuitarsRatingDown);}
        break;
      case 'up':
        switch (sortType) {
          case 'по цене':
          case '':
            return guitars.slice().sort(sortGuitarsPriceUp);
          case 'по популярности':
            return guitars.slice().sort(sortGuitarsRatingUp);}
        break;
      default:
        return getSortedGuitars();
    }
  };

  const filterByGuitarType = (guitar: Guitar) => {
    if(Object.values(guitarType).toString() === Object.values(GUITARS_TYPES_CHECKED).toString() || guitarType[guitar.type] === true) {
      return guitar;
    }
  };

  const filterByStringsQuantity = (guitar: Guitar) => {
    if(stringsQuantity.length === 0 || stringsQuantity.includes(guitar.stringCount)) {
      return guitar;
    }
  };

  const guitarsForRendering = getSortedAndOrderedGuitars()?.filter((guitar)=>(guitar.price >= minPriceFilter && guitar.price <= maxPriceFilter)).filter(filterByGuitarType).filter(filterByStringsQuantity);

  const handlePreviousNextPageClick = (evt: SyntheticEvent<HTMLAnchorElement>) => {
    evt.preventDefault();

    if(guitarsForRendering !== undefined){
      const guitarFrom = guitarsFromTo[0];
      const guitarTo = guitarsFromTo[1];
      const guitarsLength = guitarsForRendering.length;
      const page = evt.currentTarget.textContent;

      if(page === 'Далее') {
        setIsDeactivateNextPage(true);
        setIsDeactivatePreviousPage(false);

        if(cardsRendered[END_CARD_INDEX] >= 3*CARDS_PER_PAGE){
          setIsPreviousPage(true);
        } else {
          setIsPreviousPage(false);
        }

        setGuitarsFromTo([guitarFrom+CARDS_PER_PAGE, Math.min(guitarTo+CARDS_PER_PAGE, guitarsLength)]);
        (store.dispatch as ThunkAppDispatch)(updateCardsRendered([guitarFrom+CARDS_PER_PAGE, Math.min(guitarTo+CARDS_PER_PAGE, guitarsLength)]));

        if(guitarTo+CARDS_PER_PAGE >= guitarsLength){
          setIsNextPage(false);
        }
      }

      if(page === 'Назад') {
        setIsDeactivatePreviousPage(true);
        setIsDeactivateNextPage(false);
        const residualCards = cardsRendered[END_CARD_INDEX] % CARDS_PER_PAGE;

        if(residualCards === 0) {
          setGuitarsFromTo([guitarFrom-CARDS_PER_PAGE, guitarTo-CARDS_PER_PAGE]);
          (store.dispatch as ThunkAppDispatch)(updateCardsRendered([guitarFrom-CARDS_PER_PAGE, guitarTo-CARDS_PER_PAGE]));
        } else {
          setGuitarsFromTo([guitarFrom-CARDS_PER_PAGE, guitarTo-residualCards]);
          (store.dispatch as ThunkAppDispatch)(updateCardsRendered([guitarFrom-CARDS_PER_PAGE, guitarTo-residualCards]));
        }
      }

      setIsActivePage('');

    }
  };

  const handlePageClick = (evt: SyntheticEvent<HTMLAnchorElement>) => {
    evt.preventDefault();

    if(guitarsForRendering !== undefined){
      const guitarsLength = guitarsForRendering.length;
      const page = evt.currentTarget.textContent;
      setIsDeactivateNextPage(false);

      if(page !== null) {
        setGuitarsFromTo([(+page-1)*CARDS_PER_PAGE, Math.min(+page*CARDS_PER_PAGE, guitarsLength)]);
        setIsPreviousPage(false);
        (store.dispatch as ThunkAppDispatch)(updateCardsRendered([(+page-1)*CARDS_PER_PAGE, Math.min(+page*CARDS_PER_PAGE, guitarsLength)]));
      }

      if(guitarsLength > 3*CARDS_PER_PAGE) {
        setIsNextPage(true);}
    }
  };

  useEffect(()=>{
    const guitarTypesforUrlSearch = Object.entries(guitarType).filter((item)=>item[GUITAR_TYPE_CHECKED_FLAG] === true).map((item)=>item[GUITAR_TYPE_CHECKED_INDEX]).join('&');
    const getURL = `${pageURL}${guitarTypesforUrlSearch.length > 0 ? `?_type=${guitarTypesforUrlSearch}`:''}${stringsQuantity.length > 0 ? `&_stringCount=${stringsQuantity.join('&')}`: ''}${ sortType.length > 0 ? `?_sort=${sortType}`:''}${orderType.length > 0 ? `&_order=${orderType}`: ''}`;
    history.push({
      pathname: window.location.pathname,
      search: getURL,
    });
  },[guitarType, stringsQuantity, sortType, orderType, cardsRendered]);

  return(
    <>
      <Logo />
      <div className="wrapper">
        <Header />
        <main className="page-content">
          <div className="container">
            <h1 className="page-content__title title title--bigger">Каталог гитар</h1>
            <ul className="breadcrumbs page-content__breadcrumbs">
              <li className="breadcrumbs__item"><a className="link" href="./main.html">Главная</a>
              </li>
              <li className="breadcrumbs__item"><Link className="link" to="#">Каталог</Link>
              </li>
            </ul>
            <div className="catalog">
              <CatalogFilter guitarsForRendering={guitarsForRendering ? guitarsForRendering : guitars}/>
              <CatalogSort />
              <div className="cards catalog__cards">
                {guitarsForRendering?.slice(cardsRendered[START_CARD_INDEX],cardsRendered[END_CARD_INDEX]).map((guitar) => (
                  <ProductCard key={guitar.id} guitar={guitar} />
                ))}
              </div>
              <div className="pagination page-content__pagination">
                <ul className="pagination__list">
                  {isPreviousPage? <PreviousPage pageURL={pageURL} isDeactivatePreviousPage={isDeactivatePreviousPage} onClick={handlePreviousNextPageClick}/> : '' }
                  {PAGENATION.map((page) => (
                    guitarsForRendering && ((page-1)*CARDS_PER_PAGE < guitarsForRendering.length)
                      ?
                      <li key={page}
                        className={`pagination__page ${ isActivePage === page.toString() ? 'pagination__page--active' : ''}`}
                      >
                        <Link className="link pagination__page-link" to={`catalog/page_${page}`} onClick={(evt) => {
                          setIsActivePage(page.toString());
                          handlePageClick(evt);
                        }}
                        >{page}
                        </Link>
                      </li>
                      :''))}
                  {isNextPage && guitarsForRendering !== undefined && guitarsForRendering?.length > CARDS_PER_PAGE*PAGENATION[PAGENATION.length-1]
                    ? <NextPage pageURL={pageURL} isDeactivateNextPage={isDeactivateNextPage} onClick={handlePreviousNextPageClick} />
                    : '' }
                </ul>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>

  );
}

export {CatalogPage};
export default connector(CatalogPage);
