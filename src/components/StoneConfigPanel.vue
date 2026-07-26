<template>
  <div class="card shadow-sm">
    <div class="card-header bg-primary text-white">
      <h4 class="card-title mb-0">{{ title }}</h4>
    </div>
    <div class="card-body">
      <div class="mb-4">
        <label class="form-label">源石品级</label>
        <select
          v-model="localGrade"
          class="form-select"
          @change="onGradeChange"
        >
          <option value="">请选择品级</option>
          <option v-for="grade in gradeOptions" :key="grade" :value="grade">
            {{ grade }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label class="form-label">皇冠词条数</label>
        <select
          v-model="localCrownCount"
          class="form-select"
          :disabled="!localGrade"
          @change="onCrownCountChange"
        >
          <option value="">请先选择品级</option>
          <option
            v-for="count in crownOptions"
            :key="count"
            :value="count"
          >
            {{ count }}
          </option>
        </select>
      </div>

      <div v-if="localGrade">
        <label class="form-label">词条列表</label>
        <ul class="list-group">
          <li
            v-for="(entry, index) in entries"
            :key="index"
            class="list-group-item d-flex align-items-center justify-content-between"
            :class="entry.isCrown ? 'crown-bg' : ''"
          >
            <span class="d-flex align-items-center gap-2">
              <span v-if="entry.isCrown" class="text-2xl">👑</span>
              <span>{{ entry.isCrown ? '皇冠' : '普通' }}</span>
            </span>
            <span class="badge bg-secondary">词条{{ index + 1 }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { STONE_GRADES, GRADE_CONFIG } from '../constants/stoneData'
import { generateEntries } from '../utils/synthesis'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({ grade: '', crownCount: 0 })
  }
})

const emit = defineEmits(['update:modelValue'])

const localGrade = ref(props.modelValue.grade)
const localCrownCount = ref(props.modelValue.crownCount)

watch(
  () => props.modelValue,
  (newVal) => {
    localGrade.value = newVal.grade
    localCrownCount.value = newVal.crownCount
  },
  { deep: true }
)

const gradeOptions = computed(() => Object.values(STONE_GRADES))

const crownOptions = computed(() => {
  if (!localGrade.value) return []
  const config = GRADE_CONFIG[localGrade.value]
  const options = []
  for (let i = 0; i <= config.entryCount; i++) {
    options.push(i)
  }
  return options
})

const entries = computed(() => {
  if (!localGrade.value) return []
  return generateEntries(localGrade.value, localCrownCount.value)
})

const onGradeChange = () => {
  localCrownCount.value = 0
  emit('update:modelValue', {
    grade: localGrade.value,
    crownCount: 0
  })
}

const onCrownCountChange = () => {
  emit('update:modelValue', {
    grade: localGrade.value,
    crownCount: localCrownCount.value
  })
}
</script>

<style scoped>
.crown-bg {
  background: linear-gradient(to right, #fefce8, #fffbeb);
  border-color: #fde68a;
}
</style>
