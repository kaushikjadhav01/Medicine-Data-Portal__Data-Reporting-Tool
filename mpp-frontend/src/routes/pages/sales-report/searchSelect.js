import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import 'ag-grid-enterprise';
import { Select } from 'antd';

const { Option } = Select



export const SearchSelect = forwardRef((props, ref) => {

    const [optionValue, setOptionValue] = useState(props.value);
    const [editing, setEditing] = useState(true);

    const refContainer = useRef(null);
    const productSelect = useRef(null);

    useEffect(() => {
        focus();
    }, []);

    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return optionValue;
            },
            isPopup() {
                return true;
            }
        }
    });

    useEffect(() => {
        if (!editing) {
            props.api.stopEditing()
        }
    }, [editing]);

    const focus = () => {
        window.setTimeout(() => {
            let container = ReactDOM.findDOMNode(refContainer.current);
            if (container) {
                container.focus();
                productSelect.current.focus();
            }
        })
    };

    const setValues = () => {
        const { selectValues } = props.colDef
        return selectValues.map(val => <Option key={val} >{val}</Option>)
    }


    const handleSelect = (val) => {
        setOptionValue(val);
        setEditing(false)
    }



    return (
        <div ref={refContainer}
            tabIndex={1} // important - without this the key presses wont be caught
        >
            <Select
                showSearch
                mode='tags'
                showArrow={true}
                placeholder='Enter product name'
                style={{ width: 200 }}
                onSelect={handleSelect}
                // defaultOpen={true}
                // autoFocus={true}
                ref={productSelect}
            >
                {setValues()}
            </Select>
        </div>
    );
});
