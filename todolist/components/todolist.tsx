import React, { useState, useEffect, FunctionComponent } from 'react';

import { createToDoListItem, deleteToDoListItem, useToDoListItemEntries, updateToDoListItem } from '../graphql/api'

import { IToDoListItem } from "../interfaces/IToDoListItem";

import { AddItem } from "./addItem";
import { ToDoListItem } from "./todolistItem";

export const ToDoList: FunctionComponent<{}> = () => {

    const { data, errorMessage } = useToDoListItemEntries();

    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([] as IToDoListItem[]);
    const [newItemText, setNewItemText] = useState("");
    const [showDoneItems, setShowDoneItems] = useState(false);
    const [errors, setErrors] = useState("");

    function getItems(data: any) {
        return data ? data.entries.data.reverse() : [];
    }

    useEffect(() => {
        if (!items.length) {
            setItems(getItems(data))
        }
    }, [data, items.length])

    const onChangeItemDone = (_id: string): void => {
        changeItemDone(_id);
    }

    const changeItemDone = (_id: string): void => {
        let itemIsDone = false;
        let message = "";
        console.log("_id: " + _id);
        const theItem = items.find(i => i._id === _id);
        if (theItem) {
            theItem.isDone = !theItem.isDone;
            message = theItem.message;
            itemIsDone = theItem.isDone;
        }

        updateToDoListItem(_id, message, itemIsDone)
            .then((data) => {
                // const newItem: IToDoListItem = {
                //     message: data.data.createToDoListItem.message,
                //     isDone: data.data.createToDoListItem.isDone,
                //     id: data.data.createToDoListItem._id,
                // }
                // setItems([newItem, ...items]);
                // setNewItemText("");
            })
            .catch((error) => {
                console.log(`boo :( ${error}`)
                alert('Error');
            })

        setItems([...items]);
    }

    const onDeleteItem = (_id: string): void => {
        console.log("_id: " + _id);

        deleteToDoListItem(_id)
            .then((data) => {
                // const newItem: IToDoListItem = {
                //     message: data.data.createToDoListItem.message,
                //     isDone: data.data.createToDoListItem.isDone,
                //     id: data.data.createToDoListItem._id,
                // }
                // setItems([newItem, ...items]);
                // setNewItemText("");
            })
            .catch((error) => {
                console.log(`boo :( ${error}`)
                alert('Error');
            })

        const newItems = [...items].filter(i => i._id !== _id);
        setItems(newItems);
    }



    const onChangeNewItemText = (text: string): void => {
        setNewItemText(text);
    }

    const onAddNewItem = (): void => {
        const message = newItemText;
        const isDone = false;

        createToDoListItem(message, isDone)
            .then((data) => {
                const newItem: IToDoListItem = {
                    message: data.data.createToDoListItem.message,
                    isDone: data.data.createToDoListItem.isDone,
                    _id: data.data.createToDoListItem._id,
                }
                setItems([newItem, ...items]);
                setNewItemText("");
            })
            .catch((error) => {
                console.log(`boo :( ${error}`)
                alert('Error');
            })
    }

    const onChangeShowDoneItems = (): void => {
        setShowDoneItems(!showDoneItems);
    }

    let toDoListItems: any[] = [];
    if (items.length) {
        toDoListItems = items.filter((i) => i.isDone === showDoneItems).map((i) => <ToDoListItem key={i._id} id={i._id} message={i.message} isDone={i.isDone} onChangeItemDone={onChangeItemDone} onDeleteItem={onDeleteItem}/>);
    }

    return (
        <div className="main">
            <h1>To Do List</h1>
            {isLoading &&
                <div>Loading...</div>
            }
            {errors !== "" &&
                <div style={{ color: "red" }}>{errors}</div>
            }
            <div className="radio">
                <label>In Progress:<input type="radio" checked={!showDoneItems} onChange={onChangeShowDoneItems}></input></label>
                <label>Done:<input type="radio" checked={showDoneItems} onChange={onChangeShowDoneItems}></input></label>
            </div>
            {!showDoneItems &&
                <AddItem onAddNewItem={onAddNewItem} onChangeNewItemText={onChangeNewItemText} newItemText={newItemText} />
            }
            {toDoListItems.length > 0 &&
                <div className="todolist">
                    {toDoListItems}
                </div>
            }
            {toDoListItems.length === 0 &&
                <div>No items</div>
            }
            {/* <div><pre>{JSON.stringify(items, null, 2)}</pre></div> */}
        </div>
    );
};

