<script setup>
const ctr = ref(1)
const { data, pending, refresh } = await useAsyncData(() => $fetch(`http://back.test/users`), { watch: [ctr] })

</script>

<template>
    <div>
        {{ data }}
        <div class="flex justify-center gap-2">
            <button :disabled="pending" @click="ctr++">
                +
            </button>
            <button :disabled="pending" @click="refresh">
                ⟳
            </button>
        </div>
    </div>
</template>
