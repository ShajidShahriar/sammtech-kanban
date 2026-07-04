export type Priority  = 'High' | 'Medium' | 'Low'
export type ColumnId = 'Backlog' | 'Todo' | 'In Progress' | 'Review'

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

}

export interface BoardData{
    tasks:Task[],
    columns:{
        id:ColumnId,
        title:string; 
    }[]
}