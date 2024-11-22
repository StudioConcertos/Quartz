<template>
  <Form :validation-schema="registerSchema" @submit="console.log($event)">
    <h2 class="text-center text-3xl">New here?</h2>
    <div class="whitespace"></div>
    <div class="flex flex-col gap-4">
      <FormInput name="email" type="email" placeholder="Email" />
      <FormInput name="password" type="password" placeholder="Password" />
      <FormInput
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
      />
    </div>
    <div class="whitespace"></div>
    <button type="submit" class="primaryButton py-4!">
      Register
      <div class="i-carbon-login ml-2" />
    </button>
  </Form>
</template>

<script setup lang="ts">
import zod from "zod";

const registerSchema = toTypedSchema(
  zod
    .object({
      email: zod.string().email(),
      password: zod
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
      confirmPassword: zod.string(),
    })
    .superRefine((val, ctx) => {
      if (val.password !== val.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }
    })
);
</script>
