<template>
  <Form :validation-schema="loginSchema" @submit="console.log($event)">
    <h2 class="text-center text-3xl">Welcome back!</h2>
    <div class="whitespace"></div>
    <div class="flex flex-col gap-4">
      <Field name="email" type="email" placeholder="Email" />
      <ErrorMessage name="email" />
      <Field name="password" type="password" placeholder="Password" />
      <ErrorMessage name="password" />
    </div>
    <div class="whitespace"></div>
    <button type="submit" class="primaryButton py-4!">
      Sign In
      <div class="i-carbon-login ml-2" />
    </button>
  </Form>
</template>

<script setup lang="ts">
import zod from "zod";

const loginSchema = toTypedSchema(
  zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
  })
);
</script>
