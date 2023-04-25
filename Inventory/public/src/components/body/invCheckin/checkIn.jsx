import React, {useState, useEffect} from 'react';
import SelectComponent from '../checkout/dropdown';
import '../../../App.css';
import axios from 'axios';




function CheckIn (e) {

    const [values, setValues] = useState('');
    const [items, setItems] = useState([]);
    const [loader, setLoader] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [rows, setRows] = useState(7);
    const [componentStates, setComponentStates] = useState(
        [...Array(rows)].map(() => ({
            inputValue: '',
            selectedValue: ''
        }))
    );

    const handleInputChange = (value, index) => {
        setComponentStates((prevStates) => {
          const newState = [...prevStates];
          newState[index].selectedValue = value;
          return newState;
        });
      };
    
    const handleInputValueChange = (value, index) => {
        setComponentStates((prevStates) => {
            const newState = [...prevStates];
            newState[index].inputValue = value;
            return newState;
        });
    };


    useEffect(() => {
      setLoader(true);
      axios.get('/api/items')
          .then((response) => {
            const data = response.data;
          setItems(data);
          setLoader(false);
          })
          .catch((error) => {
          console.log(error);
          setLoader(false);
          });
    }, []);


    const clearAll = (e) => {
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

    function addItems(e) {
        e.preventDefault();
        
        const form = document.querySelector('form');
        let selectComponent, quantityInput, unitInput, reorderInput;

        const emptyRow = [...Array(rows)].find((_, i) => {
            selectComponent = componentStates[i].inputValue;
            unitInput = form.querySelector(`input[name=unit${i}]`);
            reorderInput = form.querySelector(`input[name=reorder${i}]`);
            quantityInput = form.querySelector(`input[name=quantity${i}]`);
            if (selectComponent 
                && quantityInput.value 
                && unitInput.value 
                && reorderInput.value
                ) {
                if ((quantityInput.value < 1 || quantityInput.value === '') && selectComponent) {
                  alert('Please input positive quantity');
                }
                if ((selectComponent && (!quantityInput.value || !unitInput.value || !reorderInput.value))
                    || (quantityInput.value && (!selectComponent || !unitInput.value || !reorderInput.value))
                    || (unitInput.value && (!selectComponent || !quantityInput.value || !reorderInput.value))
                    || (reorderInput.value && (!selectComponent || !unitInput.value || !quantityInput.value))){
                        alert('All fields must be completed!');
                    }
                if (empName && selectComponent && (quantityInput.value >= 1 
                    || quantityInput.value !== '')) {
                        axios.put('/api/items/' + selectComponent +'/checkin', 
                        {
                            Item: selectComponent,
                            unit: unitInput.value,
                            Quantity: quantityInput.value,
                            Reorder: reorderInput.value,
                        }
                    )

                }
                }
            }
        );
        clearAll();
    }

    const addRow = () => {
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



    return(
        <div className="w-full flex min-h-[85%] ">
            <div className='w-1/2 overflow-y-auto flex flex-col justify-center items-center 
            top-1/4 min-h-full  border-gray-500 px-5'>
                <form className='shadow-md shadow-gray-600 shadow-right-xl 
                rounded-lg p-4 flex flex-col justify-center mt-4 mb-4 bg-white'>
                    <label className='flex justify-center text-xl font-bold mb-4'>
                                Check-In Inventory</label>
                    <div className='flex flex-row justify-center my-4'>
                        <label className="block text-gray-700 mb-2 pr-2" 
                        htmlFor="employee-name"> Employee Name:</label>
                        <input id="employee-name" className='border border-gray-400 
                        rounded-md max-h-6 py-2 px-4 mb-4' type='text' name='employeeName' required 
                        />
                    </div>
                    <table className='max-w-full'>
                        <thead className='text-sm mb-6'>
                            <tr>
                                <th>Part Name</th>
                                <th>Re-Order At</th>
                                <th>Unit</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(rows)].map((_, i) => {
                                return(
                                <tr key={i}>
                                    <td>
                                        <SelectComponent 
                                        name={`partName${i}`}
                                        className={`partName${i}`}
                                        options={items.map((item) => ({ label: item.ItemNum, value: item.Item }))}
                                        onChange={(value) => handleInputChange(value, i)}
                                        inputValues={componentStates[i].inputValue}
                                        setInputValues={(value) => handleInputValueChange(value, i)}
                                        index={i}
                                        />

                                    </td>
                                    <td>
                                        <input type='number' name={`reorder${i}`} className='max-w-1/3 overflow-hidden text-ellipsis border
                                        border-gray-400 rounded-md mb-2' />
                                    </td>
                                    <td>
                                        <input type='text' name={`unit${i}`} className='max-w-1/3 overflow-hidden text-ellipsis border
                                        border-gray-400 rounded-md mb-2' />
                                    </td>
                                    <td>
                                        <input type='number' name={`quantity${i}`} className='max-w-1/3 overflow-hidden text-ellipsis border
                                        border-gray-400 rounded-md mb-2' min="1" required />
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                    <div className='flex justify-center'>
                        <button type='submit' className='text-black bg-yellow-400 
                        border-none rounded-md p-1 ml-2 mr-2 min-w-20 max-w-30 min-h-12 max-h-20'
                        onClick={(e) => addItems (e)} >
                            Submit</button>
                        <button type='button' className='text-black bg-yellow-400 
                        border-none rounded-md p-1 ml-2 min-w-20 max-w-30 min-h-12 max-h-20'
                        onClick={clearAll}>
                            Cancel</button>
                    </div>
                    <div className='flex justify-center pt-3'>
                        <button type='button' className='text-black bg-yellow-400 
                        border-none rounded-md p-1 mr-2 min-w-20 max-w-30 min-h-12 max-h-20'
                        onClick={addRow}>
                        Add Item</button>
                    </div>
                </form>
            </div>
            <div className="w-1/2 overflow-auto flex-row top-1/4">
                <div className='my-4 mr-4 shadow-md shadow-gray-600 shadow-right-xl 
                rounded-lg p-4 flex flex-row justify-center mt-4 mb-4 bg-white overflow-y-auto'>
                    <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                        <li className='flex flex-col justify-center font-bold pb-4 text-center'>Items</li> 
                            {items &&
                            items.map((item, index) => (
                                <li key={`${item.Item}_${index}`} className='flex justify-center border-b 
                                border-gray-800 mb-2 bg-white' id = 'part-id'> 
                                    {item.Item}
                                </li>
                            ))}
                    </ul>
                    <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                        <li className='flex flex-col justify-center font-bold pb-4 text-center'>Unit</li>   
                            {items &&
                            items.map((item, index) => (
                                    <li key={`${item.unit}_${index}`} className='flex justify-center border-b 
                                    border-gray-800 mb-2 bg-white'> 
                                        {item.unit}
                                    </li>
                            ))}
                    </ul>
                    <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                        <li className='flex flex-col justify-center font-bold pb-4 text-center'>Quantity</li> 
                            {items &&
                            items.map((item, index) => (
                                    <li key={`${item.Quantity}_${index}`} className='flex justify-center border-b 
                                    border-gray-800 mb-2 bg-white'> 
                                        {item.Quantity}
                                    </li>
                            ))}
                    </ul>
                    <ul className='flex flex-col justify-center list-none w-1/3 bg-white'>
                        <li className='flex flex-col justify-center font-bold pb-4 text-center'>Re-Order At</li>   
                            {items &&
                            items.map((item, index) => (
                                    <li key={`${item.Reorder}_${index}`} className='flex justify-center border-b 
                                    border-gray-800 mb-2 bg-white'> 
                                        {item.Reorder}
                                    </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
        );
};

export default CheckIn;
