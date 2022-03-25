import { useMemo, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router';
import { omit } from 'lodash-es';
import { Filter } from '../types/common';

type useFilterQueryTypes = [
  Filter,
  (fieldName: string) => (value: string) => void,
  (fieldName: string) => () => void
];

const getQueryStringFromObject = (filter: Filter) => new URLSearchParams(filter).toString();

const getObjectFromQueryString = (urlSearch: string) => {
  const paramsEntries = new URLSearchParams(urlSearch).entries();
  return Object.fromEntries(paramsEntries);
};

export default function useFilterQuery<T extends Filter>(
  getFilterQuery?: (query: string) => T,
  getSearchQuery?: (filter: Filter) => string,
): useFilterQueryTypes {
  const { search } = useLocation();
  const history = useHistory();

  const filter = useMemo(() =>
    // используем функцию переданную через параметры или дефолтную
    (getFilterQuery ? getFilterQuery(search) : getObjectFromQueryString(search)),
  [search, getFilterQuery],
  );

  const setSearchQuery = useCallback((filterArg: Filter) => {
  // используем функцию переданную через параметр или дефолтную
    const urlSearch = getSearchQuery
      ? getSearchQuery(filterArg)
      : getQueryStringFromObject(filterArg).toString();

    history.push(urlSearch);
  },
  [history, getSearchQuery],
  );

  const сhangeFilter = useCallback((fieldName: string) => (value: string) => {
    const newFilter = { ...filter, [fieldName]: value };

    setSearchQuery(newFilter);
  },
  [filter, setSearchQuery],
  );

  const сlearFilter = useCallback((fieldName: string) => () => {
    const newFilter = omit(filter, fieldName);

    setSearchQuery(newFilter);
  },
  [filter, setSearchQuery],
  );
  // возвращаем сам фильтр и две функции для его изменения
  return [filter, сhangeFilter, сlearFilter];
}
