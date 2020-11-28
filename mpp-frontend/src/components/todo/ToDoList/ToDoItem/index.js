import React from "react";
import {Avatar, Badge, Checkbox} from "antd";

import labels from "routes/inBuiltApps/Todo/data/labels";
import users from "routes/inBuiltApps/Todo/data/users";


const ToDoItem = (({todo, onTodoSelect, onTodoChecked, onMarkAsStart}) => {
  let user = null;
  if (todo.user > 0)
    user = users[todo.user - 1];
  return (
    <div className="gx-module-list-item">
      <div className="gx-module-list-icon">
        <Checkbox color="primary"
                  checked={todo.selected}
                  onClick={(event) => {
                    event.stopPropagation();
                    onTodoChecked(todo);
                  }}
                  value="SelectTodo"
                  className="gx-icon-btn"
        />

        <div onClick={() => {
          todo.starred = !todo.starred;
          onMarkAsStart(todo);
        }}>
          {todo.starred ?
            <i className="gx-icon-btn icon icon-star"/> :
            <i className="gx-icon-btn icon icon-star-o"/>
          }

        </div>
      </div>
      <div className="gx-module-list-info" onClick={() => {
        onTodoSelect(todo);
      }}>
        <div className="gx-module-todo-content">
          <div className={`gx-subject ${todo.completed && 'gx-text-muted gx-text-strikethrough'}`}>
            {todo.title}
          </div>
          <div className="gx-manage-margin">
            {labels.map((label, index) => {
              return (todo.labels).includes(label.id) &&
                <Badge key={index} count={label.title} style={{backgroundColor: label.color}}/>
            })}
          </div>
        </div>
        <div className="gx-module-todo-right">
          {user === null ? <Avatar>U</Avatar>
            : <Avatar alt={user.name}
                      src={user.thumb}/>}
        </div>
      </div>
    </div>

  )
});

export default ToDoItem;
