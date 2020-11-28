import React, {useState} from 'react';
import {Tabs} from "antd";
import Widget from "components/Widget";
import TaskItem from "./TaskItem";

const TabPane = Tabs.TabPane;

const TaskList = (props) => {

  const [taskList, setTaskList] = useState(props.taskList);


  const onChange = (data) => {
    setTaskList(
      taskList.map(task => {
        if (task.id === data.id) {
          task.completed = !data.completed;
        }
        return task;
      })
    )
  };

  return (
    <Widget title="Task List" styleName="gx-card-tabs"
            extra={<i className="icon icon-search-new gx-pointer gx-fs-xxl gx-text-primary"/>}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="All Task" key="1">
          {taskList.map((task, index) =>
            <TaskItem key={index} data={task} onChange={onChange}/>)
          }
        </TabPane>
        <TabPane tab="My Task" key="2">{
          taskList.map((task, index) =>
            <TaskItem key={"2" + index} data={task} onChange={onChange}/>)
        }</TabPane>
      </Tabs>
    </Widget>
  );
};


export default TaskList;
