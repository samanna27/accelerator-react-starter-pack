import { Link } from 'react-router-dom';
import { SyntheticEvent } from 'react';

type PreviousPageProps = {
  onClick: (evt: SyntheticEvent<HTMLAnchorElement>) => void,
  pageURL: string,
}

function PreviousPage({onClick, pageURL}: PreviousPageProps): JSX.Element {

  return (
    <li className="pagination__page pagination__page--next" id="next" >
      <Link className="link pagination__page-link" to={pageURL}
        onClick={(evt) => {
          onClick(evt);
        }}
      >
      Назад
      </Link>
    </li>
  );
}

export default PreviousPage;
