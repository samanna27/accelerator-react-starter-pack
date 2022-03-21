import { Puff } from 'react-loader-spinner';

function LoadingScreen(): JSX.Element {
  return (
    <>
      <div style={{display: 'flex', justifyContent: 'center', alignSelf: 'center', alignContent: 'center', minHeight: '100vh', alignItems: 'center'}}>
        <Puff
          color="#00BFFF"
          height={500}
          width={500}
        />
      </div>
      <div className="your-loader"></div>
    </>
  );
}

export default LoadingScreen;
