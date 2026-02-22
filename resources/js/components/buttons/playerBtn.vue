<template>
    <div v-show="gameStarted && !selectedPlayers" class="button">
        <button @click="createNewPlayers(player_id)" class="btn wHover">{{ player_id }} Speler(s)</button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const { props } = defineProps(['player_id', 'gameStarted', 'selectedPlayers']);
const emits = defineEmits();

function createNewPlayers(player_id) {
    emits('create-players', player_id);
}
</script>
