// Minimal wrapper around Brevo's REST API — avoids pulling in their full SDK
// for a single call. Docs: https://developers.brevo.com/reference/createcontact
export async function addContactToBrevo(email: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;
  if (!apiKey || !listId) {
    throw new Error("BREVO_API_KEY ou BREVO_LIST_ID manquant.");
  }

  const response = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      listIds: [Number(listId)],
      updateEnabled: true,
    }),
  });

  // Brevo returns 400 "duplicate_parameter" when the contact already exists
  // on this list — that's a success from the signup form's point of view.
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    if (response.status === 400 && body?.code === "duplicate_parameter") return;
    throw new Error(`Brevo a refusé l'ajout du contact : ${response.status} ${JSON.stringify(body)}`);
  }
}
