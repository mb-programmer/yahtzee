<template>
    <button @click="lockDie(die_id)" class="dice textHover" :class="{ 'text-danger': die_locked }">
        {{ eyes }}
    </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const { props } = defineProps(['die_id', 'die_locked', 'eyes']);
const emits = defineEmits();

function lockDie(die_id) {
    emits('lock-die', die_id);
}
</script>
