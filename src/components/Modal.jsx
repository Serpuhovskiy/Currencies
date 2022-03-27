import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ReactLoading from 'react-loading';

function Modal({ valute, modalClose }) {
    const [items, setItems] = useState([]);

    function addZero(num) {
        if (num >= 0 && num <= 9) {
            return "0" + num;
        }
        else {
            return "" + num;
        }
    }

    function setDate(days) {
        let date = new Date();
        date.setDate(date.getDate() - days);
        let year = String(date.getFullYear());
        let month = addZero(date.getMonth() + 1);
        let day = addZero(date.getDate());
        return { year, month, day }
    }


    async function ax(val) {
        let mas = [];

        for (let i = 1; i < 11; i++) {
            let day = setDate(i).day-1;
            let month = setDate(i).month;
            let year = setDate(i).year;
            await axios
                .get(`https://www.cbr-xml-daily.ru/archive/${year}/${month}/${day}/daily_json.js`)
                .then((res) => mas.push({ date: `${day}.${month}.${year}`, value: res.data.Valute[val] }))
                .catch(err => {
                    mas.push({ date: `${day}.${month}.${year}`, value: 'Курс ЦБ РФ на данную дату не установлен' });
                });
        }
        return mas;
    }

    useEffect(async () => {
        let data = await ax(valute);
        setItems(data)
    }, [])

    return (
        <div className='modal' onClick={modalClose}>
            <div className="modal__wrapper">
                <button className="modal_close-btn">X</button>
                <h1>Данные за 10 дней по валюте {valute}</h1>
                {items.length === 0 && <ReactLoading type={'spin'} className="loading__spinner" color="red" />}
                <ul className="content__list">
                    {
                        items.map(function (el, index) {
                            if (typeof (el.value) === 'object') {
                                return <li className='content__list-item' key={index}>
                                    <div className="date">{el.date}</div>
                                    <div className="value">{el.value.Value}</div>
                                </li>
                            } else return <li className='content__list-item' key={index}><div className="date">{el.date}</div>
                                <div className="value">{el.value}</div></li>
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default Modal