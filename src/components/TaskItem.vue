<template>
  <div class="task-card" :class="{ completed: task.completed, [task.priority]: true }">
    <div class="task-main">
      <input 
        type="checkbox" 
        :checked="task.completed" 
        @change="$emit('toggle-complete', task.id)" 
      />

      <div v-if="!isEditing" class="task-info">
        <h3 class="task-title">{{ task.title }}</h3>
        <p class="task-desc" v-if="task.description">{{ task.description }}</p>
        <span class="task-date">Created: {{ task.createdAt }}</span>
      </div>

      <div v-else class="edit-inputs">
        <input v-model="editTitle" placeholder="Title" />
        <input v-model="editDescription" placeholder="Description" />
        <button @click="saveEdit" class="btn-save">Save</button>
      </div>
    </div>

    <div class="task-actions">
      <select 
        :value="task.priority" 
        @change="$emit('change-priority', task.id, $event.target.value)"
        class="priority-select"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button @click="toggleEdit" class="btn-edit">
        {{ isEditing ? 'Cancel' : 'Edit' }}
      </button>

      <button @click="$emit('delete-task', task.id)" class="btn-delete">Delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['toggle-complete', 'change-priority', 'delete-task', 'edit-task'],
  data() {
    return {
      isEditing: false,
      editTitle: this.task.title,
      editDescription: this.task.description
    }
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing
      if (this.isEditing) {
        this.editTitle = this.task.title
        this.editDescription = this.task.description
      }
    },
    saveEdit() {
      if (!this.editTitle.trim()) return
      this.$emit('edit-task', {
        id: this.task.id,
        title: this.editTitle,
        description: this.editDescription
      })
      this.isEditing = false
    }
  }
}
</script>

<style scoped>
.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border-left: 5px solid #ccc;
}

.task-card.low { border-left-color: #28a745; }
.task-card.medium { border-left-color: #ffc107; }
.task-card.high { border-left-color: #dc3545; }

.task-card.completed { opacity: 0.6; }
.task-card.completed .task-title { text-decoration: line-through; }

.task-main { display: flex; align-items: center; gap: 12px; flex: 1; }
.task-title { margin: 0; font-size: 16px; }
.task-desc { margin: 4px 0 0 0; font-size: 13px; color: #666; }
.task-date { font-size: 11px; color: #999; }

.edit-inputs { display: flex; gap: 8px; flex: 1; }
.edit-inputs input { padding: 4px 8px; font-size: 14px; }

.task-actions { display: flex; align-items: center; gap: 8px; }
.priority-select { padding: 4px 8px; }

.btn-edit, .btn-delete, .btn-save {
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.btn-edit { background: #e0e0e0; }
.btn-save { background: #28a745; color: white; }
.btn-delete { background: #dc3545; color: white; }
</style>