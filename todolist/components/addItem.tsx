import React, { FunctionComponent } from 'react';

type IProps = {
    onAddNewItem: () => void;
    onChangeNewItemText: (text: string) => void;
    newItemText: string;
}

export const AddItem: FunctionComponent<IProps> = (props: IProps) => {

    const onChangeNewItemText = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        const text = e.currentTarget.value;
        props.onChangeNewItemText(text);
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            props.onAddNewItem();
        }
    }

    const addBtnDisabled = props.newItemText.trim().length === 0;

    return (
        <div className="addToDo">
            <input type="text" value={props.newItemText} onChange={onChangeNewItemText} onKeyDown={onKeyDown} placeholder={"Enter new item"}></input>
            <button onClick={props.onAddNewItem} disabled={addBtnDisabled}>Add</button>
        </div>
    )
}