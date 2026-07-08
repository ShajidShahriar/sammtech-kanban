export type Priority  = 'High' | 'Medium' | 'Low'
export type ColumnId = string;

export interface Label {
    id:string,
    name:string,
    color:string,
}

export interface Assignee{
    id:string,
    name:string,
    avatarUrl?:string // placeholder fornow 


}

export interface Task {
    id:string,
    title:string,
    description:string,
    status:ColumnId,
    assignee?:Assignee,
    labels:Label[],
    priority: Priority,
    dueDate?:string ;
    progress?:number;
}

export interface BoardData{
    tasks:Task[],
    columns:{
        id:ColumnId,
        title:string; 
    }[],
    labels:Label[];
}