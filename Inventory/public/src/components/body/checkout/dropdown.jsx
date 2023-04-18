import React, { useEffect, useState, useRef} from 'react';
import './dropdown.css';

const SelectComponent = ({
    options,
    placeholder = '',
    onChange,
    inputValues,
    setInputValues,
    index

}) => {

    const [inputs, setInputs] = useState("");

    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(()=> {
        const clickOutside = (e) => {
            if(!ref.current.contains(e.target)){
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', clickOutside);

        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, [ref]);


    const onInputChange = (e) => {
        setInputValues(e.target.value);
    }
    const onItemSelect  = (option) => {
        onChange !== undefined && onChange(option.key)
        onChange !== undefined && setInputValues(option.value)
        setOpen(false);
    }


    const onInputClick = () => {
        setOpen((previousInput) => !previousInput);
    }

    return <div name='dropdown-container' className='max-w-1/3' ref={ref}>
        <div className='input-container' >
            <input type = 'text' className='w-full overflow-hidden text-ellipsis border
    border-gray-400 rounded-md mb-2 px-1' value={inputValues} onClick={onInputClick} onChange={onInputChange}/>
            <div name = 'dropdown' id='dropdown' className={`dropdown ${open ? 'visible' : ""}`}>
                {options.filter((item) => {
                    const searchValue = inputValues.toLocaleLowerCase();
                    const val = item.value.toLocaleLowerCase();

                    if(!searchValue) return true;
                    return val.startsWith(searchValue);
                }).map((o, index) => {
                    return(
                        <div key={index}
                        onClick={() => onItemSelect(o)}
                        name='option'
                        className='flex align-middle h-inherit pl-10px pb-2 px-1 cursor-pointer
                        bg-white hover:bg-yellow-400'>
                            {o.value}
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
}

export default SelectComponent
