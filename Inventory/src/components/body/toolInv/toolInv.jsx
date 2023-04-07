import './toolInv.css';

const Tools = () => {
    return(
        <div className="addTool">
            <div className='toolInfoCO'>
                <div>
                    <label className='block text-xl font-bold'>Add Tool</label>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2 pr-2"> Tool Name:</label>
                    <input className= 'border border-gray-400 rounded-lg py-2 px-4 mb-4 w-1/4' type='text' />
                </div>
                <div>
                    <label className="block text-gray-700 mb-2 pr-2">Part ID:</label>
                    <input className= 'border border-gray-400 rounded-lg py-2 px-4 mb-4 w-1/4' type='text' />
                </div>
            </div>
            <div className="toolList">
                <div className="part">
                    <ul>
                        {/* {items.map(item => (
                        <li key={item.id}>{item.name}</li>
                        ))} */}
                    </ul>
                </div>
            </div>
        </div>
    )
};

export default Tools;