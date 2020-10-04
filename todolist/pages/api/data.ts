import { IToDoListItem } from "../../interfaces/IToDoListItem";

export const items: IToDoListItem[] = [];

// export const items: IToDoListItem[] = [
//     { id: 1, message: "Item Alpha", isDone: false },
//     { id: 2, message: "Item Beta", isDone: false },
//     { id: 3, message: "Item Gamma", isDone: false },
// ];

export const addItem = (newItem: IToDoListItem): void => {
    items.push(newItem)
}