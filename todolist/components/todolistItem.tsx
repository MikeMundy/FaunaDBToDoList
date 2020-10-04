import React, { FunctionComponent } from 'react';

export type ToDoListItemProps = {
    id: string;
    onChangeItemDone: (id: string) => void;
    onDeleteItem: (id: string) => void;
    message: string,
    isDone: boolean,
};

export const ToDoListItem: FunctionComponent<ToDoListItemProps> = (props: ToDoListItemProps) => {

    const onChange = (): void => {
        props.onChangeItemDone(props.id);
    }

    const onDelete = (): void => {
        props.onDeleteItem(props.id);
    }    

    return (
        <div>
            <span>{props.message}: id {props.id}</span>
            <span>
                <input type="checkbox" onChange={onChange} checked={props.isDone}/>
                {props.isDone &&
                    <input type="button" value="X" onClick={onDelete}/>
                }
            </span>
        </div>
    );
}

