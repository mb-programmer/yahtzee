<template>
    <div v-show="selectedPlayers && gameStarted" class="button">
        <button @click="startOrResetGame(startOrReset)" class="btn wHover">{{ startOrReset }}</button>
    </div>
</template>

<script setup>
import {defineEmits} from "vue";

const { props } = defineProps(['gameStarted', 'selectedPlayers', 'startOrReset']);
const emits = defineEmits();

function startOrResetGame(startOrReset) {
    emits('startOrResetGame', startOrReset);
}

</script>
