/*
 * Signet Ninja Technologies Ltd. Co.
 * MultiConnect - General Message Submission
 *
 * Browser-side submission handler for the Signet Ninja
 * MultiConnect General Message Submission form.
 */

async function FormMsgSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget.closest("form");

    /*
     * Confirm that the form satisfies its native HTML validation
     * requirements before attempting submission.
     */
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    /*
     * Locate the form's existing status elements.
     */
    const loading = form.querySelector(".loading");
    const errorMessage = form.querySelector(".error-message");
    const sentMessage = form.querySelector(".sent-message");
    const submitButton = form.querySelector('button[type="submit"]');

    /*
     * Reset the visible submission state.
     */
    loading.style.display = "block";
    errorMessage.style.display = "none";
    sentMessage.style.display = "none";
    submitButton.disabled = true;

    /*
     * Construct the JSON payload expected by the
     * MultiConnect General Message Submission Worker.
     */
    const payload = {
        "formmsg-submit.name":
            document.getElementById("formmsg-submit.name").value,

        "formmsg-submit.email":
            document.getElementById("formmsg-submit.email").value,

        "formmsg-submit.subj":
            document.getElementById("formmsg-submit.subj").value,

        "formmsg-submit.body":
            document.getElementById("formmsg-submit.body").value,

        "formmsg-submit.sub.genann":
            document.getElementById("formmsg-submit.sub.genann").checked
    };

    try {
        /*
         * Submit the message to the dedicated Signet Ninja
         * MultiConnect General Message Submission Worker.
         */
        const response = await fetch(
            "https://caerbannog-44ee2d20e8e04416b363cbec0d0a540b.signetninja-prod.workers.dev/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        /*
         * The Worker returns JSON for both successful and
         * controlled failure responses.
         */
        const result = await response.json();

        if (!response.ok || result.success !== true) {
            throw new Error("Message submission failed.");
        }

        /*
         * Submission succeeded.
         */
        form.reset();
        sentMessage.style.display = "block";
    }
    catch (error) {
        /*
         * Do not expose Worker, Graph, SharePoint, or other
         * infrastructure details to the user.
         */
        console.error("MultiConnect General Message Submission failed.");

        errorMessage.textContent =
            "We couldn't send your message. Please try again.";

        errorMessage.style.display = "block";
    }
    finally {
        loading.style.display = "none";
        submitButton.disabled = false;
    }
}