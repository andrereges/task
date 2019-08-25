<template>
  <div>
        <input type="text" class="task-input" placeholder="What needs to be done"
            v-model="newTask" @keyup.enter="addTask">
        
        <transition-group name="fade" enter-active-class="animated fadeInUp" leave-active-class="animated fadeOutDown">
            <task-item v-for="(task, index) in tasksFiltered" :key="task.id" 
                :task="task" :index="index" :checkAll="!anyRemaining"></task-item>
        </transition-group>

        <div class="extra-container">
            <task-check-all :anyRemaining="anyRemaining"></task-check-all>
            <task-items-remaining :remaining="remaining"></task-items-remaining>
        </div>

        <div class="extra-container">
            <task-filtered></task-filtered>
            <div>
                <transition name="fade">
                    <task-clear-completed :showClearCompletedButton="showClearCompletedButton"></task-clear-completed>
                </transition>
            </div>
        </div>
  </div>
</template>

<script>
import TaskItem from './TaskItem'
import TaskItemsRemaining from './TaskItemsRemaining'
import TaskCheckAll from './TaskCheckAll'
import TaskFiltered from './TaskFiltered'
import TaskClearCompleted from './TaskClearCompleted'

export default {
    name: 'task-list',
    components: {
        TaskItem,
        TaskItemsRemaining,
        TaskCheckAll,
        TaskFiltered,
        TaskClearCompleted,
    },
    data () {
        return {
        newTask: '',
        idForTask: 3,
        beforeEditCache: '',
        filter: 'all',
        tasks: [
            {
                'id': 1,
                'title': 'Finish Vue Screencast',
                'completed': false,
                'editing': false
            },
            {
                'id': 2,
                'title': 'Take over world',
                'completed': false,
                'editing': false
            }
        ]
        }
    },
    created() {
        eventBus.$on('removedTask', (index) => this.removeTask(index))
        eventBus.$on('finishedEdit', (data) => this.finishedEdit(data))
        eventBus.$on('checkAllChanged', (checked) => this.checkAllTasks(checked))
        eventBus.$on('filterChanged', (filter) => this.filter = filter)
        eventBus.$on('clearCompletedTasks', () => this.clearCompleted())
    },
    beforeDestroy() {
        eventBus.$off('removedTask', (index) => this.removeTask(index))
        eventBus.$off('finishedEdit', (data) => this.finishedEdit(data))
        eventBus.$off('checkAllChanged', (checked) => this.checkAllTasks(checked))
        eventBus.$off('filterChanged', (filter) => this.filter = filter)
        eventBus.$off('clearCompletedTasks', () => this.clearCompleted())
    },
    computed: {
        remaining() {
            return this.tasks.filter(task => !task.completed).length
        },
        anyRemaining() {
            return this.remaining != 0
        },
        tasksFiltered() {
            if(this.filter == 'all') {
                return this.tasks
            } else if(this.filter == 'active') {
                return this.tasks.filter(task => !task.completed)
            } else if(this.filter == 'completed') {
                return this.tasks.filter(task => task.completed)
            }

            return this.tasks
        },
        showClearCompletedButton() {
            return this.tasks.filter(task => task.completed).length > 0
        }
    },
    methods: {
        addTask() {
            if (this.newTask.trim().length == 0){
                return
            }

            this.tasks.push({
                id: this.idForTask,
                title: this.newTask,
                completed: false
            })

            this.newTask = ''
            this.idForTask++
        },
        removeTask(index) {
            this.tasks.splice(index, 1)
        },
        checkAllTasks() {
            this.tasks.forEach(
                (task) => task.completed = event.target.checked
            )
        },
        clearCompleted() {
            this.tasks = this.tasks.filter(task => !task.completed)
        },
        finishedEdit(data) {
            this.tasks.splice(data.index, 1, data.task)
        }
    }
}
</script>

<style lang="scss">
    @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css");

    .task-input {
        width: 100%;
        padding: 10px 18px;
        font-size: 18px;
        margin-bottom: 16px;

        &:focus {
            outline: 0;
        }
    }
    .task-item {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation-duration: 0.3s;
    }
    .remove-item {
        cursor: pointer;
        margin-left: 14px;
        &:hover {
            color: black;
        }
    }
    .task-item-left {
        display: flex;
        align-items: center;
    }
    .task-item-label {
        padding: 10px;
        border: 1px solid white;
        margin-left: 12px;
    }
    .task-item-edit {
        font-size: 24px;
        color: #2c3e50;
        margin-left: 12px;
        width:100%;
        padding: 10px;
        border: 1px solid #ccc;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;

        &:focus {
            outline: none;
        }
    }
    .completed {
        text-decoration: line-through;
        color: grey;
    }
    .extra-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        border-top: 1px solid lightgrey;
        padding-top: 14px;
        margin-bottom: 14px;
    }
    button {
        font-size: 14px;
        background-color: white;
        appearance: none;
    
        &:hover {
            background: lightgreen;
        }
        &:focus {
            outline: none;
        }
    }
    .active {
        background: lightgreen;
    }

    //Css Transitions
    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
