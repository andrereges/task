<template>
    <div class="task-item">
        <div class="task-item-left">
            <input type="checkbox" v-model="completed" @change="doneEdit">

            <div v-if="!editing" @dblclick="editTask" class="task-item-label" 
                :class="{ completed: completed }">
                {{ title }}
            </div>
            
            <input v-else class="task-item-edit" type="text" v-model="title" 
                @blur="doneEdit" @keyup.enter="doneEdit" @keyup.esc="cancelEdit" 
                v-focus>
        </div>
        <div class="remove-item" @click="removeTask(index)">
            &times;
        </div>
    </div>
</template>

<script>
export default {
    name: 'task-item',
    props: {
        task: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        checkAll: {
            type: Boolean,
            required: true,
        }
    },
    data() {
        return {
            'id': this.task.id,
            'title': this.task.title,
            'completed': this.task.completed,
            'editing': this.task.editing,
            'beforeEditCache': '',
        }
    },
    watch: {
        checkAll() {
            this.completed = this.checkAll ? true : this.task.completed
        }
    },
    directives: {
        focus: {
            inserted: (el) => el.focus()
        }
    },
    methods: {
        removeTask(index) {
            this.$emit('removedTask', index)
        },
        editTask() {
            this.beforeEditCache = this.title
            this.editing = true
        },
        doneEdit() {
            if (this.title.trim() == ''){
                this.title = this.beforeEditCache
            }

            this.editing = false
            this.$emit('finishedEdit', {
                'index': this.index,
                'task': {
                    'id': this.id,
                    'title': this.title,
                    'completed': this.completed,
                    'editing': this.editing,
                }
            })
        },
        cancelEdit() {
            this.title = this.beforeEditCache
            this.editing = false
        },
    }
}
</script>