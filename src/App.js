import './App.css';
import axios from 'axios'
import { useEffect, useState } from 'react';
import cn from 'classnames';
import Modal from './components/Modal';
import ReactLoading from 'react-loading';


function App() {

  const [items, setItems] = useState();
  const [tooltip, setTooltip] = useState([false, '', 0, 0]);
  const [modal, setModal] = useState('');

  function addZero(num) {
    if (num >= 0 && num <= 9) {
      return "0" + num;
    }
    else {
      return "" + num;
    }
  }

  let date = new Date();
  let year = date.getFullYear();
  let month = addZero(date.getMonth() + 1);
  let day = addZero(date.getDate())-1;


  const func = async () => {
    axios
      .get(`https://www.cbr-xml-daily.ru/archive/${year}/${month}/${day}/daily_json.js`)
      .then((res) => setItems(res.data))
      .catch(err => {
        if (err.request) setItems('Курс ЦБ РФ на сегодняшнюю дату не установлен');
      });
  }

  useEffect(() => {
    func();
  }, [])

  useEffect(() => {
    if (modal[0]) document.body.style.overflow = 'hidden'; else document.body.style.overflow = 'auto'
  }, [modal[0]])

  const mouseEnter = (e) => {
    if (e.target.nodeName === 'LI') {
      setTooltip([true, e.target.children[1].innerHTML, e.pageX - 65, e.pageY + 30]);
    } else {
      setTooltip([true, e.target.parentElement.children[1].innerHTML, e.pageX - 65, e.pageY + 30]);
    }

  }
  const mouseLeave = () => {
    setTooltip([false, '']);
  }

  const modalClose = (e) => {
    if (e.target.classList.contains('modal_close-btn') || e.target.classList.contains('modal')) {
      setModal('');
    }
  }

  return (
    <div className='content'>
      {modal && <Modal valute={modal} modalClose={modalClose} />}
      <div className="content__wrapper" >
        {tooltip[0] && <span className="tooltiptext" style={{ left: tooltip[2] + 'px', top: tooltip[3] + 'px' }}>{tooltip[1]}</span>}
        {!items && <ReactLoading type={'spin'} className="loading__spinner" color="red" />}
        {items && <div>
          <h1 className='content__title'>Котировки валют на {`${day}.${month}.${year}`}</h1>
          <ul className="content__list">
            {typeof(items) === 'object' ? Object.keys(items.Valute).map(function (key) {
              let percent = Number((((this[key].Value / this[key].Previous) - 1) * 100).toFixed(3));

              return <li className='content__list-item' key={this[key].NumCode} onMouseMove={mouseEnter} onMouseLeave={mouseLeave} onClick={() => setModal(key)}>
                <div className="code">{this[key].NumCode}</div>
                <div className="hidden">{this[key].Name}</div>
                <div className="rub">{this[key].Value}</div>
                <div className={cn("percent", (percent < 0) ? "down" : "up")}>
                  {`${(percent > 0) ? "+" + percent : percent}%`}
                </div>
              </li>
            }, items.Valute) : <li className='content__list-item list-item_alone'>{items}</li>}

          </ul>
        </div>
        }
      </div>

    </div>
  );
}

export default App;
