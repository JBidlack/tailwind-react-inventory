import React, {useState, useEffect} from 'react';
const [empName, setEmpName] = useState(true);
const [items, setItems] = useState([]);
const [loader, setLoader] = useState(false);
const [rows, setRows] = useState(7);
const [componentStates, setComponentStates] = useState(
    [...Array(rows)].map(() => ({
        inputValue: '',
        selectedValue: ''
    }))
);

export const handleInputChange = (value, index) => {
    setComponentStates((prevStates) => {
        const newState = [...prevStates];
        newState[index].selectedValue = value;
        return newState;
    });
    };

export const handleInputValueChange = (value, index) => {
setComponentStates((prevStates) => {
    const newState = [...prevStates];
    newState[index].inputValue = value;
    return newState;
});
};


export  const clearAll = (e) => {
const form = document.querySelector('form');
let Input;

const emptyRow = [...Array(rows)].forEach((_, i) => {
    Input = form.querySelectorAll(`input`);
    Input.forEach(input => input.value = '');
    setComponentStates(prevStates => {
    return prevStates.map(state => {
        return {
        ...state,
        inputValue: ''
        };
    });
    });
})
}


export  function updateItems(e) {
e.preventDefault();

const form = document.querySelector('form');
let selectComponent, quantityInput;
let nameInput = form.querySelector(`input[name=employeeName]`);

if (nameInput.value === '') {
    setEmpName(false);
}
else {
    setEmpName(true);
}

const emptyRow = [...Array(rows)].find((_, i) => {
    selectComponent = componentStates[i].inputValue;
    quantityInput = form.querySelector(`input[name=quantity${i}]`);
    if ((quantityInput.value < 1 || quantityInput.value === '') && selectComponent) {
    alert('Please input quantity');
    }
    if (empName && selectComponent && (quantityInput.value >= 1 || quantityInput.value !== '')) {
    axios.put('/api/items/' + selectComponent + '/checkout', {
        Quantity: parseInt(quantityInput.value)
    })
        .then((response) => {
        setItems(previous => previous.map((item) => {
            if (item.Item === selectComponent) {
            return { ...item, Quantity: response.data.Quantity }
            }
            else {
            return item
            }
        }))
        })
        .catch((error) => {
        console.log(error.response.data)
        });
    }
});
clearAll();
}

export const addRow = () => {
    setRows(rows +1 );
    setComponentStates(prevStates => {
        return [
        ...prevStates,
        {
            inputValue: '',
            selectedValue: ''
        }
        ];
    });
};