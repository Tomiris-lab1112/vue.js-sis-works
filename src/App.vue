<template>
  <div class="container">
    <h1>Task Management App</h1>

    <!-- 1. Статистика -->
    <section class="stats">
      <div class="stat-card">Total: <strong>{{ tasks.length }}</strong></div>
      <div class="stat-card">Active: <strong>{{ activeTasksCount }}</strong></div>
      <div class="stat-card">Completed: <strong>{{ completedTasksCount }}</strong></div>
    </section>

    <!-- 2. Поиск и Фильтры -->
    <section class="controls">
      <input v-model="searchQuery" placeholder="Search by title..." class="search-input" />
      <select v-model="statusFilter">
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <select v-model="priorityFilter">
        <option value="all">All Priorities</option>
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
    </section>

    <!-- 3. Форма добавления -->
    <form @submit.prevent="addTask" class="add-form">
      <input v-model="newTask.title" placeholder="Task Title" required />
      <input v-model="newTask.description" placeholder="Description" />
      <select v-model="newTask.priority">
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <button type="submit" class="btn-add">Add Task</button>
    </form>

    <!-- 4. Список задач -->
    <div class="task-list">
      <TaskItem 
        v-for="task in filteredTasks" 
        :key="task.id" 
        :task="task"
        @toggle-complete="id => { const t = tasks.find(x => x.id === id); if (t) t.completed = !t.completed }"
        @change-priority="(id, p) => { const t = tasks.find(x => x.id === id); if (t) t.priority = p }"
        @delete-task="id => tasks = tasks.filter(t => t.id !== id)"
        @edit-task="updated => { const t = tasks.find(x => x.id === updated.id); if (t) Object.assign(t, updated) }"
      />
      <p v-if="!filteredTasks.length" class="no-tasks">No tasks found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TaskItem from './components/TaskItem.vue'

const searchQuery = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const newTask = ref({ title: '', description: '', priority: 'medium' })

const initialTasks = [
  { id: 1, title: 'Read Vue Slides', description: 'Review Lectures 2, 3, and 4', createdAt: '2026-10-01', completed: true, priority: 'high' },
  { id: 2, title: 'Submit SIS 2', description: 'Upload Task Manager to GitHub', createdAt: '2026-10-05', completed: false, priority: 'high' }
]

const tasks = ref(JSON.parse(localStorage.getItem('vue_tasks_sis2')) || initialTasks)

watch(tasks, newTasks => localStorage.setItem('vue_tasks_sis2', JSON.stringify(newTasks)), { deep: true })

const activeTasksCount = computed(() => tasks.value.filter(t => !t.completed).length)
const completedTasksCount = computed(() => tasks.value.filter(t => t.completed).length)

const filteredTasks = computed(() => tasks.value.filter(t => {
  const matchesSearch = t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  const matchesStatus = statusFilter.value === 'all' ? true : statusFilter.value === 'completed' ? t.completed : !t.completed
  const matchesPriority = priorityFilter.value === 'all' ? true : t.priority === priorityFilter.value
  return matchesSearch && matchesStatus && matchesPriority
}))

const addTask = () => {
  if (!newTask.value.title.trim()) return
  tasks.value.push({
    id: Date.now(),
    title: newTask.value.title,
    description: newTask.value.description,
    createdAt: new Date().toLocaleDateString(),
    completed: false,
    priority: newTask.value.priority
  })
  newTask.value = { title: '', description: '', priority: 'medium' }
}
</script>

<style>
body { background-color: #f8f9fa; margin: 0; }
.container { max-width: 650px; margin: 30px auto; padding: 20px; font-family: Arial, sans-serif; }
.stats { display: flex; gap: 15px; margin-bottom: 20px; }
.stat-card { flex: 1; background: #ffffff; padding: 12px; border-radius: 6px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.controls, .add-form { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.controls input, .controls select, .add-form input, .add-form select { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; }
.search-input { flex: 2; }
.add-form input { flex: 1; }
.btn-add { background: #1a73e8; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
.no-tasks { text-align: center; color: #666; margin-top: 20px; }
</style>