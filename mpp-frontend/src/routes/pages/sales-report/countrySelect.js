import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import 'ag-grid-enterprise';
import { Select } from 'antd';

const { Option } = Select



export const CountrySelect = forwardRef((props, ref) => {

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
        return props.colDef.selectValues.map(val => <Option key={val} >{val}</Option>)
    }

    const handleSelect = (val) => {
        setOptionValue(val);
        setEditing(false)
    }

    const handleClear = () => {
        setOptionValue(null);
        setEditing(false)
    }

    return (
        <div ref={refContainer}
            tabIndex={1} // important - without this the key presses wont be caught
        >
            <Select
                showSearch
                showArrow={true}
                allowClear
                placeholder='Enter country name'
                style={{ width: 200 }}
                onSelect={handleSelect}
                defaultValue={props.value}
                onClear={handleClear}
                ref={productSelect}
            >
                {setValues()}
            </Select>
        </div>
    );
});
