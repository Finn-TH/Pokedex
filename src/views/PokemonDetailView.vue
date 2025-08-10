<script setup></script>
<template>
  <div class="container py-4">
    <h1 class="mb-3">Pokemon Details</h1>
    <div class="alert alert-warning">
      Details for: <strong>{{ $route.params.idOrName }}</strong>
    </div>
  </div>
</template>
