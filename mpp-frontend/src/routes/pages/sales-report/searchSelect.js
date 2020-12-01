import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import 'ag-grid-enterprise';
import { Select } from 'antd';

const { Option } = Select



export const SearchSelect = forwardRef((props, ref) => {

    const [optionValue, setOptionValue] = useState(props.value);
    const [editing, setEditing] = useState(true);
    const [productList, setProductList] = useState([])
    const [productNameList, setProductNameList] = useState([])
    const refContainer = useRef(null);
    const productSelect = useRef(null);

    useEffect(() => {
        focus();
        setProductList(props.colDef.selectValues)
        if (props.value) {
            let tempSelectValues = [...props.colDef.selectValues]
            tempSelectValues.push(props.value)
            setProductNameList(tempSelectValues)
        } else {
            setProductNameList(props.colDef.selectValues);
        }
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
        return productNameList.map(val => <Option key={val} >{val}</Option>)
    }


    const handleSelect = (val) => {
        setOptionValue(val);
        setEditing(false)
    }

    const handleSearch = (value) => {
        let tempProductList = [...productList]
        if (!tempProductList.includes(value)) {
            tempProductList.push(value)
        }
        setProductNameList(tempProductList)
    }

    return (
        <div ref={refContainer}
            tabIndex={1} // important - without this the key presses wont be caught
        >
            <Select
                showSearch
                // mode='tags'
                showArrow={true}
                allowClear
                placeholder='Enter product name'
                style={{ width: 200 }}
                onSelect={handleSelect}
                onSearch={handleSearch}
                defaultValue={props.value}
                // defaultOpen={true}
                // autoFocus={true}
                ref={productSelect}
            >
                {setValues()}
            </Select>
        </div>
    );
});
