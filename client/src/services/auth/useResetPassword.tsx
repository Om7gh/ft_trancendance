async function resetPassword(token) {
  const res = await fetch(`/api/v1/auth/validate-reset-token`, {
    method: "POST",
  });
}
