import { State } from '../../types/state';
import { connect, ConnectedProps } from 'react-redux';
import { FocusEvent, ChangeEvent, FormEvent, useState, useEffect, useRef} from 'react';
import { store } from '../../index';
import { updateMinPriceFilter, setMaxPriceFilter, updateGuitarTypeFilter, updateStringsTypeFilter, updateCardsRendered } from '../../store/action';
import { ThunkAppDispatch } from '../../types/action';
import { GUITAR_TYPE, STRINGS_QUANTITY_BY_GUITAR, GUITAR_STRINGS, CARDS_PER_PAGE } from '../../const';
import { nanoid } from 'nanoid';
import { StringsChecked, Guitar } from '../../types/guitar';
import {toast} from 'react-toastify';

const FAIL_MESSAGE = 'Нет Гитар в таком ценовом диапазоне';

type CatalogFilterProps = {
  guitarsFilteredByTypeAndStrings: Guitar[],
}

const mapStateToProps =({minPriceFilter, maxPriceFilter, guitarType, cardsRendered, stringsQuantity, guitars}: State) => ({
  minPriceFilter,
  maxPriceFilter,
  guitarType,
  cardsRendered,
  stringsQuantity,
  guitars,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>
type ConnectedComponentProps = PropsFromRedux & CatalogFilterProps;

function CatalogFilter({minPriceFilter, maxPriceFilter, guitarType, stringsQuantity, guitars, guitarsFilteredByTypeAndStrings }: ConnectedComponentProps):JSX.Element {
  const minPrice =  Math.min(...guitars.map((guitar) => guitar.price));
  const maxPrice = Math.max(...guitars.map((guitar) => guitar.price));
  const minPriceGuitarsRendered =  Math.min(...guitarsFilteredByTypeAndStrings.map((guitar) => guitar.price));
  const maxPriceGuitarsRendered = Math.max(...guitarsFilteredByTypeAndStrings.map((guitar) => guitar.price));
  const minPriceRef = useRef<HTMLInputElement>(null);
  const maxPriceRef = useRef<HTMLInputElement>(null);
  const [isMinPrice, setIsMinPrice] = useState<string>('');
  const [isMaxPrice, setIsMaxPrice] = useState<string>('');
  const [isStringsActive, setIsStringsActive] = useState<Set<number>>(new Set());
  const [stringsChecked, setStringsChecked] = useState<StringsChecked>({
    4: false,
    6: false,
    7: false,
    12: false,
  });

  useEffect(() => {
    setIsMinPrice(minPriceFilter.toLocaleString());
    if(minPriceFilter !== 0 && minPriceFilter !== minPrice && minPriceRef.current && minPriceRef.current.value === ''){
      minPriceRef.current.placeholder = minPriceFilter.toLocaleString();
    }
  }, [minPriceFilter]);

  useEffect(() => {
    setIsMaxPrice(maxPriceFilter.toLocaleString());
    if(maxPriceFilter !== 0 && maxPriceFilter !== maxPrice && maxPriceRef.current && maxPriceRef.current.value === ''){
      maxPriceRef.current.placeholder = maxPriceFilter.toLocaleString();
    }
  }, [maxPriceFilter]);

  useEffect(() => {
    const guitarTypeState = {};
    Object.assign(guitarTypeState, guitarType);// копируем объект со статусом по активированным типам гитар
    const stringsOfGuitarTypesChecked: Set<number> = new Set();
    const guitarCheckedStrings = Object.entries(guitarTypeState).filter((item) => item[1] === true).map((item)=> STRINGS_QUANTITY_BY_GUITAR[item[0]]); //формируем массив массивов струн по активированным типам гитар
    guitarCheckedStrings.forEach((guitarStrings) => guitarStrings.forEach((strings)=> stringsOfGuitarTypesChecked.add(strings))); // формируем Set струн по активированным гитарам

    stringsQuantity.forEach((stringChecked) => {
      if(stringsOfGuitarTypesChecked.has(stringChecked)){
        return '';
      } else {
        handleStringsQuantityChange(stringChecked);
      }
    });

    setIsStringsActive(stringsOfGuitarTypesChecked); //пушим Set струн по активированным гитарам в состояние
  }, [guitarType]);

  useEffect(() => {
    if(minPriceRef.current && minPriceRef.current.value !== '' && Number(minPriceRef.current.value) < minPriceGuitarsRendered) {
      if(minPriceGuitarsRendered > maxPriceFilter) {
        toast.info(FAIL_MESSAGE);
        minPriceRef.current.value = maxPriceFilter.toString();
      } else {
        minPriceRef.current.value = minPriceGuitarsRendered.toString();
        (store.dispatch as ThunkAppDispatch)(updateMinPriceFilter(minPriceGuitarsRendered));
      }
    }

    if(maxPriceRef.current && maxPriceRef.current.value !== '' && Number(maxPriceRef.current.value) > maxPriceGuitarsRendered) {
      if(maxPriceGuitarsRendered < minPriceFilter) {
        toast.info(FAIL_MESSAGE);
        maxPriceRef.current.value = minPriceFilter.toString();
      } else {
        maxPriceRef.current.value = maxPriceGuitarsRendered.toString();
        (store.dispatch as ThunkAppDispatch)(setMaxPriceFilter(maxPriceGuitarsRendered));
      }
    }

    stringsQuantity.forEach((string) => { //при изменении checkedStrings (приходящих из search параметра URL) актуализируем внутреннее состояние stringsChecked, которое используется для смены статусов в handleStringsQuantityChange
      if(stringsChecked[string] !== true) {
        stringsChecked[string] = ! stringsChecked[string];
        setStringsChecked(stringsChecked);
      }});

  }, [guitarType, stringsQuantity]);

  const handlePriceBlur = (evt: FocusEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const value = Math.max(minPriceGuitarsRendered, Math.min(maxPriceGuitarsRendered, Number(evt.target.value)));

    if(evt.target.id === 'priceMin' ){
      if(minPriceRef.current !== null && Number(minPriceRef.current.value) > maxPriceFilter && minPriceRef.current.value !== '')  {
        minPriceRef.current.value = maxPriceFilter.toString();
      } else if (minPriceRef.current !== null && minPriceRef.current.value === '') {
        minPriceRef.current.value = minPriceGuitarsRendered.toString();
      } else if (minPriceRef.current !== null) {
        minPriceRef.current.value = value.toString();
      }
      const valueToSet = minPriceRef.current !== null ? minPriceRef.current.value : value.toString();
      setIsMinPrice(valueToSet);
      (store.dispatch as ThunkAppDispatch)(updateMinPriceFilter(Number(valueToSet)));
    }

    if(evt.target.id === 'priceMax' ){
      if(maxPriceRef.current !== null && Number(maxPriceRef.current.value) < minPriceFilter && maxPriceRef.current.value !== '') {
        maxPriceRef.current.value = minPriceFilter.toString();
      } else if (maxPriceRef.current !== null && maxPriceRef.current.value === '') {
        maxPriceRef.current.value = maxPriceGuitarsRendered.toString();
      } else if (maxPriceRef.current !== null) {
        maxPriceRef.current.value = value.toString();
      }
      const valueToSet = maxPriceRef.current !== null ? maxPriceRef.current.value : value.toString();
      setIsMaxPrice(valueToSet);
      (store.dispatch as ThunkAppDispatch)(setMaxPriceFilter(Number(valueToSet)));
    }
  };

  const handlePriceChange = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();

    const value = evt.target.value;

    if (+evt.target.value < 0) {
      evt.target.setCustomValidity('Цена не может быть меньше 0.');
    } else if(evt.target.id === 'priceMin' && +evt.target.value < minPrice) {
      evt.target.setCustomValidity(`Минимальная цена - ${minPrice}`);
    } else if(evt.target.id === 'priceMax' && +evt.target.value > maxPrice) {
      evt.target.setCustomValidity(`Максимальная цена - ${maxPrice}`);
    } else {
      evt.target.setCustomValidity('');
    }

    if(evt.target.id === 'priceMin' ){
      if(+evt.target.value > maxPriceFilter) {
        evt.target.setCustomValidity('Минимальная цена не может быть больше максимальной.');
      }
      setIsMinPrice(value);
    }
    if(evt.target.id === 'priceMax' ){
      if(+evt.target.value < minPriceFilter) {
        evt.target.setCustomValidity('Максимальная цена не может быть меньше минимальной.');
      }
      setIsMaxPrice(value);
    }

    evt.target.reportValidity();
  };

  const handleGuitarTypeChange = (evt: FormEvent<HTMLInputElement>) => {
    evt.preventDefault();
    const type = evt.currentTarget.name;
    (store.dispatch as ThunkAppDispatch)(updateCardsRendered([0, CARDS_PER_PAGE]));
    (store.dispatch as ThunkAppDispatch)(updateGuitarTypeFilter(type));
  };

  const handleStringsQuantityChange = (item: number) => {
    stringsChecked[item] = !stringsChecked[item]; // отмечаем, какое количество струн было выбрано

    setStringsChecked(stringsChecked); // меняем объект состояния выбранных струн
    const stringsQuantityChecked: number[] = [...stringsQuantity];// копируем массив с выбранными струнами из состояния. Дальше добавляем или удаляем из массива струны в зависимости от состояния клика (true - выбрали, false - удалили)

    if(stringsChecked[item] === true) {
      stringsQuantityChecked.push(item);

    } else {
      stringsQuantityChecked.splice(stringsQuantityChecked.indexOf(item),1);
    }

    (store.dispatch as ThunkAppDispatch)(updateStringsTypeFilter(stringsQuantityChecked));
    (store.dispatch as ThunkAppDispatch)(updateCardsRendered([0, CARDS_PER_PAGE]));
  };

  return (
    <form className="catalog-filter">
      <h2 className="title title--bigger catalog-filter__title">Фильтр</h2>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">Цена, ₽</legend>
        <div className="catalog-filter__price-range">
          <div className="form-input">
            <label className="visually-hidden">Минимальная цена</label>
            <input type="number" ref={minPriceRef} placeholder={minPriceGuitarsRendered.toLocaleString('ru')} id="priceMin" name="от" defaultValue={isMinPrice} onBlur={(evt) => handlePriceBlur(evt)} onChange={(evt) => handlePriceChange(evt)} />
          </div>
          <div className="form-input">
            <label className="visually-hidden">Максимальная цена</label>
            <input type="number" ref={maxPriceRef} placeholder={maxPriceGuitarsRendered.toLocaleString('ru')} id="priceMax" name="до" defaultValue={isMaxPrice} onBlur={(evt) => handlePriceBlur(evt)} onChange={(evt) => handlePriceChange(evt)} />
          </div>
        </div>
      </fieldset>
      <fieldset className="catalog-filter__block" >
        <legend className="catalog-filter__block-title">Тип гитар</legend>
        {Object.keys(GUITAR_TYPE).map((item) => {
          const type: string = item;
          return (
            <div key={nanoid()} className="form-checkbox catalog-filter__block-item">
              <input className="visually-hidden" type="checkbox" id={type} name={type} defaultChecked={guitarType[type]} onChange={(evt) => handleGuitarTypeChange(evt)} />
              <label htmlFor={type}>{GUITAR_TYPE[type]}</label>
            </div>);
        })}
      </fieldset>
      <fieldset className="catalog-filter__block">
        <legend className="catalog-filter__block-title">Количество струн</legend>
        {GUITAR_STRINGS.map((item) => (
          <div key={item} className="form-checkbox catalog-filter__block-item">
            <input className="visually-hidden" type="checkbox" id={`${item}-strings`} name={`${item}-strings`} disabled={!isStringsActive.has(item)} checked={stringsQuantity.includes(item)} onChange={(evt) => handleStringsQuantityChange(item)} />
            <label htmlFor={`${item}-strings`}>{item}</label>
          </div>
        ))}
      </fieldset>
    </form>
  );
}

export {CatalogFilter};
export default connector(CatalogFilter);
