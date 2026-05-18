import Clock from '../widgets/Clock';
import Weather from '../widgets/Weather';

const Header = () => {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">웹 개발 학습 노트</p>
        <h1>HTML · CSS <span className="amp">&amp;</span> JS</h1>
      </div>
      <div className="header-right">
        <Weather />
        <Clock />
      </div>
    </header>
  );
};

export default Header;